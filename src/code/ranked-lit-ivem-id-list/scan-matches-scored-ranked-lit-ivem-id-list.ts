/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { AdiService, LitIvemIdMatchesDataDefinition, LitIvemIdScanMatchesDataItem, RankScoredLitIvemIdList } from '../adi/adi-internal-api';
import { Scan, ScansService } from '../scan/scan-internal-api';
import { AssertInternalError, Err, ErrorCode, LockOpenListItem, Ok, Result } from "../sys/sys-internal-api";
import { ScanMatchesRankedLitIvemIdListDefinition } from './definition/ranked-lit-ivem-id-list-definition-internal-api';
import { ScoredRankedLitIvemIdList } from './scored-ranked-lit-ivem-id-list';

export class ScanMatchesScoredRankedLitIvemIdList extends ScoredRankedLitIvemIdList {
    private readonly _scanId: string;

    private _lockedScan: Scan | undefined;
    private _dataItem: LitIvemIdScanMatchesDataItem | undefined;

    constructor(
        private readonly _adiService: AdiService,
        private readonly _scansService: ScansService,
        definition: ScanMatchesRankedLitIvemIdListDefinition,
    ) {
        super(definition, false, false, false, false);
        this._scanId = definition.scanId;
    }

    override get name() {
        const lockedScan = this._lockedScan;
        if (lockedScan === undefined) {
            throw new AssertInternalError('SMSRLIILGN2085');
        } else {
            return lockedScan.name;
        }
    }

    override get description() {
        const lockedScan = this._lockedScan;
        if (lockedScan === undefined) {
            throw new AssertInternalError('SMSRLIILGD20091');
        } else {
            return lockedScan.description;
        }
    }

    override get category() {
        const lockedScan = this._lockedScan;
        if (lockedScan === undefined) {
            throw new AssertInternalError('SMSRLIILGD20091');
        } else {
            return '';
        }
    }

    createDefinition(): ScanMatchesRankedLitIvemIdListDefinition {
        return new ScanMatchesRankedLitIvemIdListDefinition(this._scanId);
    }

    override async tryLock(locker: LockOpenListItem.Locker): Promise<Result<void>> {
        const scanId = this._scanId;
        const serviceItemLockResult = await this._scansService.tryLockItemByKey(this._scanId, locker);
        if (serviceItemLockResult.isErr()) {
            return serviceItemLockResult.createOuter(ErrorCode.ScanMatchesLitIvemIdList_TryLock);
        } else {
            const scan = serviceItemLockResult.value;
            if (scan === undefined) {
                return new Err(`${ErrorCode.ScanMatchesLitIvemIdList_ScanIdNotFound}: ${scanId}`);
            } else {
                this._lockedScan = scan;
                return new Ok(undefined);
            }
        }
    }

    override unlock(locker: LockOpenListItem.Locker) {
        if (this._lockedScan === undefined) {
            throw new AssertInternalError('SMLIILU26997');
        } else {
            this._scansService.unlockItem(this._lockedScan, locker);
            this._lockedScan = undefined;
        }
    }

    override subscribeRankScoredLitIvemIdSourceList(): RankScoredLitIvemIdList {
        if (this._dataItem !== undefined) {
            // cannot open more than once
            throw new AssertInternalError('SMSRLIILSRSLIISLD31313');
        } else {
            const lockedScan = this._lockedScan;
            if (lockedScan === undefined) {
                throw new AssertInternalError('SMSRLIILSRSLIISLL31313');
            } else {
                const scanId = lockedScan.id;
                const dataDefinition = new LitIvemIdMatchesDataDefinition();
                dataDefinition.scanId = scanId;
                this._dataItem = this._adiService.subscribe(dataDefinition) as LitIvemIdScanMatchesDataItem;
                return this._dataItem;
            }
        }
    }

    override unsubscribeRankScoredLitIvemIdSourceList(): void {
        if (this._dataItem === undefined) {
            throw new AssertInternalError('SMRLIUILIURSLIISL31313');
        } else {
            this._adiService.unsubscribe(this._dataItem);
            this._dataItem = undefined;
        }
    }
}