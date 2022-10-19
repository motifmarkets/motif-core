/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { AdiService, ScanDescriptorsDataDefinition } from '../adi/adi-internal-api';
import { ScanDescriptorsDataItem } from '../adi/scan-descriptors-data-item';
import { MultiEvent, UnreachableCaseError } from '../sys/sys-internal-api';
import { Integer, UsableListChangeTypeId } from '../sys/types';
import { LockOpenListService } from './lock-open-list-service';
import { Scan } from './scan';

export class ScansService extends LockOpenListService<Scan>{
    // private readonly _scans = new Array<Scan>();
    // private readonly _scanIdMap = new Map<string, Scan>();
    private _scansOnline = false;
    private _scansOnlineResolves = new Array<ScansService.ScansOnlineResolve>();

    private _scanDescriptorsDataItem: ScanDescriptorsDataItem;
    private _scansListChangeEventSubscriptionId: MultiEvent.SubscriptionId;

    private _listChangeMultiEvent = new MultiEvent<ScansService.ListChangeEventHandler>();
    private _scanChangeMultiEvent = new MultiEvent<ScansService.RecordChangeEventHandler>();
    private _correctnessChangeMultiEvent = new MultiEvent<ScansService.CorrectnessChangeEventHandler>();
    private _badnessChangeMultiEvent = new MultiEvent<ScansService.BadnessChangeEventHandler>();

    constructor(private readonly _adi: AdiService) {
        super();
        // const initialCount = ScansService.initialScans.length;
        // for (let i = 0; i < initialCount; i++) {
        //     const initialScan = ScansService.initialScans[i];
        //     const scan = new EditableScan();
        //     scan.id = i.toString();
        //     scan.index = i;
        //     scan.name = initialScan.name;
        //     scan.targetTypeId = initialScan.targetTypeId;
        //     scan.targetLitIvemIds = initialScan.targetLitIvemIds;
        //     scan.targetMarketIds = initialScan.targetMarkets;
        //     scan.matchCount = initialScan.matchCount;
        //     scan.criteriaTypeId = initialScan.criteriaTypeId;
        //     scan.modifiedStatusId = initialScan.modifiedStatusId;
        //     this._scans.push(scan);
        // }
    }

    start() {
        const scansDefinition = new ScanDescriptorsDataDefinition();
        this._scanDescriptorsDataItem = this._adi.subscribe(scansDefinition) as ScanDescriptorsDataItem;
        this._scansListChangeEventSubscriptionId = this._scanDescriptorsDataItem.subscribeListChangeEvent(
            (listChangeTypeId, index, count) => this.processScansListChange(listChangeTypeId, index, count)
        );

        if (this._scanDescriptorsDataItem.usable) {
            const allCount = this._scanDescriptorsDataItem.count;
            if (allCount > 0) {
                this.processScansListChange(UsableListChangeTypeId.PreUsableAdd, 0, allCount);
            }
            this.processScansListChange(UsableListChangeTypeId.Usable, 0, 0);
        } else {
            this.processScansListChange(UsableListChangeTypeId.Unusable, 0, 0);
        }
    }

    finalise() {
        this.resolveScansOnlinePromises(false);
    }

    subscribeListChangeEvent(handler: ScansService.ListChangeEventHandler) {
        return this._listChangeMultiEvent.subscribe(handler);
    }

    unsubscribeListChangeEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._listChangeMultiEvent.unsubscribe(subscriptionId);
    }

    subscribeScanChangeEvent(handler: ScansService.RecordChangeEventHandler) {
        return this._scanChangeMultiEvent.subscribe(handler);
    }

    unsubscribeScanChangeEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._scanChangeMultiEvent.unsubscribe(subscriptionId);
    }

    subscribeCorrectnessChangeEvent(handler: ScansService.CorrectnessChangeEventHandler) {
        return this._correctnessChangeMultiEvent.subscribe(handler);
    }

    unsubscribeCorrectnessChangeEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._correctnessChangeMultiEvent.unsubscribe(subscriptionId);
    }

    subscribeBadnessChangeEvent(handler: ScansService.BadnessChangeEventHandler) {
        return this._badnessChangeMultiEvent.subscribe(handler);
    }

    unsubscribeBadnessChangeEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._badnessChangeMultiEvent.unsubscribe(subscriptionId);
    }

    private notifyListChange(listChangeTypeId: UsableListChangeTypeId, recIdx: Integer, recCount: Integer) {
        const handlers = this._listChangeMultiEvent.copyHandlers();
        for (let i = 0; i < handlers.length; i++) {
            handlers[i](listChangeTypeId, recIdx, recCount);
        }
    }

    private processScansListChange(listChangeTypeId: UsableListChangeTypeId, index: Integer, count: Integer) {
        switch (listChangeTypeId) {
            case UsableListChangeTypeId.Unusable:
                this._scansOnline = false;
                break;
            case UsableListChangeTypeId.PreUsableClear:
                this.offlineAllScans(false);
                break;
            case UsableListChangeTypeId.PreUsableAdd:
                this.syncDescriptors(index, count);
                break;
            case UsableListChangeTypeId.Usable:
                this._scansOnline = true;
                this.resolveScansOnlinePromises(true);
                break;
            case UsableListChangeTypeId.Insert:
                this.syncDescriptors(index, count);
                break;
            case UsableListChangeTypeId.Remove:
                this.checkUsableNotifyListChange(UsableListChangeTypeId.Remove, orderIdx, 1);
                this.deleteScans(index, count);
                break;
            case UsableListChangeTypeId.Clear:
                this.checkUsableNotifyListChange(UsableListChangeTypeId.Clear, orderIdx, 1);
                this.offlineAllScans(true);
                break;
            default:
                throw new UnreachableCaseError('SSPSLC30871', listChangeTypeId);
        }
    }

    private syncDescriptors(index: Integer, count: Integer) {
        const nextIndex = index + count;
        const addedScans = new Array<Scan>(count);
        let addCount = 0;
        for (let i = index; i < nextIndex; i++) {
            const scanDescriptor = this._scanDescriptorsDataItem.records[i];
            const id = scanDescriptor.id;
            const scan = this.findScan(id);
            if (scan !== undefined) {
                scan.sync(scanDescriptor);
            } else {
                const addedScan = new Scan(this._adi, scanDescriptor);
                addedScans[addCount++] = addedScan;
            }
        }

        if (addCount > 0) {
            const addIdx = this.addItems(addedScans);
            this.notifyListChange(UsableListChangeTypeId.Insert, addIdx, addCount);
        }
    }

    private deleteScans(index: Integer, count: Integer) {
        //
    }

    private offlineAllScans(serverDeleted: boolean) {
        for (const scan of this._scans) {
            scan.checkSetOffline();
        }
    }

    private findScan(id: string) {
        return this._scanIdMap.get(id);
    }

    private resolveScansOnlinePromises(ready: boolean) {
        const resolveCount = this._scansOnlineResolves.length;
        if (resolveCount > 0) {
            for (const resolve of this._scansOnlineResolves) {
                resolve(ready);
            }
            this._scansOnlineResolves.length = 0;
        }
    }

}

export namespace ScansService {
    export type ListChangeEventHandler = (this: void, listChangeTypeId: UsableListChangeTypeId, index: Integer, count: Integer) => void;
    export type RecordChangeEventHandler = (this: void, index: Integer) => void;
    export type CorrectnessChangeEventHandler = (this: void) => void;
    export type BadnessChangeEventHandler = (this: void) => void;

    export type ScansOnlineResolve = (this: void, ready: boolean) => void;

/*
    export interface InitialScan {
        name: string;
        targetTypeId: ScanTargetTypeId;
        targetMarkets: readonly MarketId[] | undefined;
        targetLitIvemIds: readonly LitIvemId[] | undefined;
        matchCount: Integer;
        criteriaTypeId: EditableScan.CriteriaTypeId;
        modifiedStatusId: EditableScan.ModifiedStatusId;
    }

    export const initialScans: InitialScan[] = [
        {
            name: 'BHP Last Price > 50',
            targetTypeId: ScanTargetTypeId.Symbols,
            targetMarkets: undefined,
            targetLitIvemIds: [new LitIvemId('BHP', MarketId.AsxTradeMatch, DataEnvironmentId.Sample)],
            matchCount: 0,
            criteriaTypeId: EditableScan.CriteriaTypeId.PriceGreaterThanValue,
            modifiedStatusId: EditableScan.ModifiedStatusId.Unmodified,
        },
        {
            name: 'CBA Bid price increase > 10%',
            targetTypeId: ScanTargetTypeId.Symbols,
            targetMarkets: undefined,
            targetLitIvemIds: [new LitIvemId('CBA', MarketId.AsxTradeMatch, DataEnvironmentId.Sample)],
            matchCount: 0,
            criteriaTypeId: EditableScan.CriteriaTypeId.TodayPriceIncreaseGreaterThanPercentage,
            modifiedStatusId: EditableScan.ModifiedStatusId.Unmodified,
        },
        {
            name: 'BHP or RIO Bid price increase > 10%',
            targetTypeId: ScanTargetTypeId.Symbols,
            targetMarkets: undefined,
            targetLitIvemIds: [
                new LitIvemId('BHP', MarketId.AsxTradeMatch, DataEnvironmentId.Sample),
                new LitIvemId('RIO', MarketId.AsxTradeMatch, DataEnvironmentId.Sample),
            ],
            matchCount: 0,
            criteriaTypeId: EditableScan.CriteriaTypeId.TodayPriceIncreaseGreaterThanPercentage,
            modifiedStatusId: EditableScan.ModifiedStatusId.Unmodified,
        },
        {
            name: 'CBA bid price > last price',
            targetTypeId: ScanTargetTypeId.Symbols,
            targetMarkets: undefined,
            targetLitIvemIds: [new LitIvemId('CBA', MarketId.AsxTradeMatch, DataEnvironmentId.Sample)],
            matchCount: 0,
            criteriaTypeId: EditableScan.CriteriaTypeId.Custom,
            modifiedStatusId: EditableScan.ModifiedStatusId.Unmodified,
        },
        {
            name: 'Any bank has auction price 10% > last price',
            targetTypeId: ScanTargetTypeId.Markets,
            targetMarkets: [MarketId.AsxTradeMatch],
            targetLitIvemIds: undefined,
            matchCount: 0,
            criteriaTypeId: EditableScan.CriteriaTypeId.Custom,
            modifiedStatusId: EditableScan.ModifiedStatusId.Unmodified,
        },
    ];
*/
}
