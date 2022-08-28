/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { AdiService, LitIvemId, MarketId } from '../adi/adi-internal-api';
import { MultiEvent } from '../sys/sys-internal-api';
import { Integer, UsableListChangeTypeId } from '../sys/types';
import { Scan } from './scan';

export class ScansService {
    private readonly _scans = new Array<Scan>();

    private _listChangeMultiEvent = new MultiEvent<ScansService.ListChangeEventHandler>();
    private _scanChangeMultiEvent = new MultiEvent<ScansService.RecordChangeEventHandler>();
    private _correctnessChangeMultiEvent = new MultiEvent<ScansService.CorrectnessChangeEventHandler>();
    private _badnessChangeMultiEvent = new MultiEvent<ScansService.BadnessChangeEventHandler>();

    constructor(private readonly _adi: AdiService) {
        const scan = new Scan();
        scan.id = '1';
        scan.category = 'cat1';
        scan.name = 'name1'
        scan.description = 'description1'
        scan.index = 0;
        scan.targetTypeId = Scan.TargetTypeId.Symbols;
        scan.targetLitIvemIds = [LitIvemId.createFromCodeMarket('BHP', MarketId.AsxTradeMatch)];
        scan.matched = false;
        scan.modifiedStatusId = Scan.ModifiedStatusId.Unmodified;
        this._scans.push(scan);
    }

    start() {
        //
    }

    finalise() {
        //
    }

    get count(): Integer { return this.count; }

    getScan(index: Integer) {
        return this._scans[index];
    }

    getAllScansAsArray(): readonly Scan[] {
        return this._scans;
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

}

export namespace ScansService {
    export type ListChangeEventHandler = (this: void, listChangeTypeId: UsableListChangeTypeId, index: Integer, count: Integer) => void;
    export type RecordChangeEventHandler = (this: void, index: Integer) => void;
    export type CorrectnessChangeEventHandler = (this: void) => void;
    export type BadnessChangeEventHandler = (this: void) => void;
}
