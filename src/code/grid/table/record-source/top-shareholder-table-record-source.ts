/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import {
    AdiService,
    LitIvemId,
    TopShareholder,
    TopShareholdersDataDefinition,
    TopShareholdersDataItem
} from "../../../adi/adi-internal-api";
import {
    AssertInternalError,
    Badness,
    Integer,
    LockOpenListItem,
    MultiEvent,
    PickEnum,
    UnreachableCaseError,
    UsableListChangeTypeId
} from "../../../sys/sys-internal-api";
import { GridLayout } from '../../layout/grid-layout-internal-api';
import {
    TableFieldSourceDefinition,
    TableFieldSourceDefinitionFactoryService
} from "../field-source/definition/grid-table-field-source-definition-internal-api";
import { TableRecordDefinition, TopShareholderTableRecordDefinition } from '../record-definition/grid-table-record-definition-internal-api';
import { TableRecord } from '../record/grid-table-record-internal-api';
import { TopShareholderTableValueSource } from '../value-source/grid-table-value-source-internal-api';
import { TopShareholderTableRecordSourceDefinition } from './definition/top-shareholder-table-record-source-definition';
import { SingleDataItemTableRecordSource } from './single-data-item-table-record-source';

export class TopShareholderTableRecordSource extends SingleDataItemTableRecordSource {

    protected override readonly allowedFieldDefinitionSourceTypeIds: TopShareholderTableRecordSource.FieldDefinitionSourceTypeId[] = [
        TableFieldSourceDefinition.TypeId.TopShareholdersDataItem,
    ];

    private readonly _litIvemId: LitIvemId;
    private readonly _tradingDate: Date | undefined;
    private readonly _compareToTradingDate: Date | undefined;

    private _recordList: TopShareholder[] = [];

    private _dataItem: TopShareholdersDataItem;
    private _dataItemSubscribed = false;
    private _listChangeEventSubscriptionId: MultiEvent.SubscriptionId;
    private _badnessChangeEventSubscriptionId: MultiEvent.SubscriptionId;

    constructor(
        private readonly _adiService: AdiService,
        private readonly _tableFieldSourceDefinitionsService: TableFieldSourceDefinitionFactoryService,
        definition: TopShareholderTableRecordSourceDefinition,
    ) {
        super(definition);

        this._litIvemId = definition.litIvemId;
        this._tradingDate = definition.tradingDate;
        this._compareToTradingDate = definition.compareToTradingDate;
    }

    override createRecordDefinition(idx: Integer): TopShareholderTableRecordDefinition {
        const record = this._recordList[idx];
        return {
            typeId: TableRecordDefinition.TypeId.TopShareholder,
            mapKey: record.createKey().mapKey,
            record,
        };
    }

    override createTableRecord(recordIndex: Integer, eventHandlers: TableRecord.EventHandlers): TableRecord {
        const result = new TableRecord(recordIndex, eventHandlers);
        const topShareholder = this._recordList[recordIndex];

        const fieldList = this.fieldList;
        const sourceCount = fieldList.sourceCount;
        for (let i = 0; i < sourceCount; i++) {
            const fieldSource = fieldList.getSource(i);
            const fieldDefinitionSource = fieldSource.definition;
            const fieldDefinitionSourceTypeId =
                fieldDefinitionSource.typeId as TopShareholderTableRecordSource.FieldDefinitionSourceTypeId;
            switch (fieldDefinitionSourceTypeId) {
                case TableFieldSourceDefinition.TypeId.TopShareholdersDataItem: {
                    const valueSource = new TopShareholderTableValueSource(result.fieldCount, topShareholder, this._dataItem);
                    result.addSource(valueSource);
                    break;
                }
                default:
                    throw new UnreachableCaseError('TSTRSCTVL43309', fieldDefinitionSourceTypeId);
            }
        }

        return result;
    }

    override createDefaultLayout() {
        const result = new GridLayout();

        const topShareholdersFieldSourceDefinition = this._tableFieldSourceDefinitionsService.topShareholdersDataItem;

        result.addField(topShareholdersFieldSourceDefinition.getSupportedFieldNameById(TopShareholder.FieldId.Name));
        result.addField(topShareholdersFieldSourceDefinition.getSupportedFieldNameById(TopShareholder.FieldId.SharesHeld));
        result.addField(topShareholdersFieldSourceDefinition.getSupportedFieldNameById(TopShareholder.FieldId.TotalShareIssue));
        result.addField(topShareholdersFieldSourceDefinition.getSupportedFieldNameById(TopShareholder.FieldId.Designation));
        result.addField(topShareholdersFieldSourceDefinition.getSupportedFieldNameById(TopShareholder.FieldId.HolderKey));
        result.addField(topShareholdersFieldSourceDefinition.getSupportedFieldNameById(TopShareholder.FieldId.SharesChanged));

        return result;
    }

    override activate(opener: LockOpenListItem.Opener) {
        const definition = new TopShareholdersDataDefinition();

        definition.litIvemId = this._litIvemId;
        definition.tradingDate = this._tradingDate;
        definition.compareToTradingDate = this._compareToTradingDate;

        this._dataItem = this._adiService.subscribe(definition) as TopShareholdersDataItem;
        this._dataItemSubscribed = true;
        super.setSingleDataItem(this._dataItem);
        this._listChangeEventSubscriptionId = this._dataItem.subscribeListChangeEvent(
                (listChangeTypeId, idx, count) => this.handleDataItemListChangeEvent(listChangeTypeId, idx, count)
        );
        this._badnessChangeEventSubscriptionId = this._dataItem.subscribeBadnessChangeEvent(
            () => this.handleDataItemBadnessChangeEvent()
        );

        super.activate(opener);

        if (this._dataItem.usable) {
            const newCount = this._dataItem.count;
            if (newCount > 0) {
                this.processDataItemListChange(UsableListChangeTypeId.PreUsableAdd, 0, newCount);
            }
            this.processDataItemListChange(UsableListChangeTypeId.Usable, 0, 0);
        } else {
            this.processDataItemListChange(UsableListChangeTypeId.Unusable, 0, 0);
        }
    }

    override deactivate() {
        // TableRecordDefinitionList can no longer be used after it is deactivated
        if (this.count > 0) {
            this.notifyListChange(UsableListChangeTypeId.Clear, 0, 0);
        }

        if (!this._dataItemSubscribed) {
            throw new AssertInternalError('TSHTRDLD29987', '');
        } else {
            this._dataItem.unsubscribeListChangeEvent(this._listChangeEventSubscriptionId);
            this._listChangeEventSubscriptionId = undefined;
            this._dataItem.unsubscribeBadnessChangeEvent(this._badnessChangeEventSubscriptionId);
            this._badnessChangeEventSubscriptionId = undefined;

            super.deactivate();

            this._adiService.unsubscribe(this._dataItem);
            this._dataItemSubscribed = false;
        }
    }

    protected getCount() { return this._recordList.length; }

    protected override processUsableChanged() {
        if (this.usable) {
            this.notifyListChange(UsableListChangeTypeId.PreUsableClear, 0, 0);
            const count = this.count;
            if (count > 0) {
                this.notifyListChange(UsableListChangeTypeId.PreUsableAdd, 0, count);
            }
            this.notifyListChange(UsableListChangeTypeId.Usable, 0, 0);
        } else {
            this.notifyListChange(UsableListChangeTypeId.Unusable, 0, 0);
        }
    }

    private handleDataItemListChangeEvent(listChangeTypeId: UsableListChangeTypeId, idx: Integer, count: Integer) {
        this.processDataItemListChange(listChangeTypeId, idx, count);
    }

    private handleDataItemBadnessChangeEvent() {
        this.checkSetUnusable(this._dataItem.badness);
    }

    private insertRecordDefinition(idx: Integer, count: Integer) {
        if (count === 1) {
            const topShareholder = this._dataItem.topShareholders[idx];
            if (idx === this._recordList.length) {
                this._recordList.push(topShareholder);
            } else {
                this._recordList.splice(idx, 0, topShareholder);
            }
        } else {
            const topShareholders = new Array<TopShareholder>(count);
            let insertArrayIdx = 0;
            for (let i = idx; i < idx + count; i++) {
                const topShareholder = this._dataItem.topShareholders[i];
                topShareholders[insertArrayIdx++] = topShareholder;
            }
            this._recordList.splice(idx, 0, ...topShareholders);
        }
    }

    private processDataItemListChange(listChangeTypeId: UsableListChangeTypeId, idx: Integer, count: Integer) {
        switch (listChangeTypeId) {
            case UsableListChangeTypeId.Unusable:
                this.setUnusable(this._dataItem.badness);
                break;
            case UsableListChangeTypeId.PreUsableClear:
                this.setUnusable(Badness.preUsableClear);
                this._recordList.length = 0;
                break;
            case UsableListChangeTypeId.PreUsableAdd:
                this.setUnusable(Badness.preUsableAdd);
                this.insertRecordDefinition(idx, count);
                break;
            case UsableListChangeTypeId.Usable:
                this.setUsable(this._dataItem.badness);
                break;
            case UsableListChangeTypeId.Insert:
                this.insertRecordDefinition(idx, count);
                this.checkUsableNotifyListChange(UsableListChangeTypeId.Insert, idx, count);
                break;
            case UsableListChangeTypeId.Replace:
                throw new AssertInternalError('TSTRSPDILC19662');
            case UsableListChangeTypeId.Remove:
                this.checkUsableNotifyListChange(UsableListChangeTypeId.Remove, idx, count);
                this._recordList.splice(idx, count);
                break;
            case UsableListChangeTypeId.Clear:
                this.checkUsableNotifyListChange(UsableListChangeTypeId.Clear, idx, count);
                this._recordList.length = 0;
                break;
            default:
                throw new UnreachableCaseError('TSTRDLPDILC983338', listChangeTypeId);
        }
    }
}

export namespace TopShareholderTableRecordSource {
    export type FieldDefinitionSourceTypeId = PickEnum<TableFieldSourceDefinition.TypeId,
        TableFieldSourceDefinition.TypeId.TopShareholdersDataItem
    >;
}