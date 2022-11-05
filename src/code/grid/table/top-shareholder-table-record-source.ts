/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { AdiService, LitIvemId, TopShareholder, TopShareholdersDataDefinition, TopShareholdersDataItem } from '../../adi/adi-internal-api';
import {
    AssertInternalError,
    Badness,
    Integer,
    JsonElement,
    LockOpenListItem,
    MultiEvent,
    PickEnum,
    UnreachableCaseError,
    UsableListChangeTypeId
} from '../../sys/sys-internal-api';
import { GridLayout } from '../layout/grid-layout-internal-api';
import { SingleDataItemTableRecordSource } from './single-data-item-table-record-source';
import { TableFieldSourceDefinition } from './table-field-source-definition';
import { TableFieldSourceDefinitionsService } from './table-field-source-definitions-service';
import { TableRecordDefinition } from './table-record-definition';
import { TableRecordSource } from './table-record-source';
import { TableValueList } from './table-value-list';
import { TopShareholderTableRecordDefinition } from './top-shareholder-table-record-definition';
import { TopShareholderTableValueSource } from './top-shareholder-table-value-source';

export class TopShareholderTableRecordSource extends SingleDataItemTableRecordSource {

    protected override readonly allowedFieldDefinitionSourceTypeIds: TopShareholderTableRecordSource.FieldDefinitionSourceTypeId[] = [
        TableFieldSourceDefinition.TypeId.TopShareholdersDataItem,
    ];

    private _recordList: TopShareholder[] = [];

    private _dataItem: TopShareholdersDataItem;
    private _dataItemSubscribed = false;
    private _listChangeEventSubscriptionId: MultiEvent.SubscriptionId;
    private _badnessChangeEventSubscriptionId: MultiEvent.SubscriptionId;

    constructor(
        private readonly _adiService: AdiService,
        private readonly _tableFieldSourceDefinitionsService: TableFieldSourceDefinitionsService,
        private readonly _litIvemId: LitIvemId,
        private readonly _tradingDate: Date | undefined,
        private readonly _compareToTradingDate: Date | undefined,
    ) {
        super(TableRecordSource.TypeId.TopShareholder);
    }

    override createRecordDefinition(idx: Integer): TopShareholderTableRecordDefinition {
        const record = this._recordList[idx];
        return {
            typeId: TableRecordDefinition.TypeId.TopShareholder,
            mapKey: record.createKey().mapKey,
            record,
        };
    }

    override createTableValueList(recordIndex: Integer): TableValueList {
        const result = new TableValueList();
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

    override createDefaultlayout() {
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

    override saveToJson(element: JsonElement) {
        super.saveToJson(element);

        element.setJson(TopShareholderTableRecordSource.JsonTag.litItemId, this._litIvemId.toJson());
        if (this._tradingDate !== undefined) {
            element.setDate(TopShareholderTableRecordSource.JsonTag.tradingDate, this._tradingDate);
        }
        if (this._compareToTradingDate !== undefined) {
            element.setDate(TopShareholderTableRecordSource.JsonTag.compareToTradingDate, this._compareToTradingDate);
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

    export namespace JsonTag {
        export const litItemId = 'litItemId';
        export const tradingDate = 'tradingDate';
        export const compareToTradingDate = 'compareToTradingDate';
    }

    export function tryCreateFromJson(
        adiService: AdiService,
        tableFieldSourceDefinitionsService: TableFieldSourceDefinitionsService,
        element: JsonElement
    ): TopShareholderTableRecordSource | undefined {
        const litIvemId = LitIvemId.tryGetFromJsonElement(element, TopShareholderTableRecordSource.JsonTag.litItemId, 'TSTRSTCFJLII35533');
        if (litIvemId === undefined) {
            return undefined;
        } else {
            const tradingDate = element.tryGetDate(TopShareholderTableRecordSource.JsonTag.tradingDate, 'TSTRSTCFJLII35533');

            const compareToTradingDate = element.tryGetDate(TopShareholderTableRecordSource.JsonTag.compareToTradingDate,
                'TSTRSTCFJLII35533');

            return new TopShareholderTableRecordSource(
                adiService,
                tableFieldSourceDefinitionsService,
                litIvemId,
                tradingDate,
                compareToTradingDate,
            );
        }
    }
}
