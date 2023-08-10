/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { Badness, Integer, LockOpenListItem, MultiEvent, UnreachableCaseError, UsableListChangeTypeId } from '../../../sys/sys-internal-api';
import { TextFormatterService } from '../../../text-format/text-format-internal-api';
import {
    TableFieldCustomHeadingsService,
    TableFieldSourceDefinition,
    TableFieldSourceDefinitionRegistryService
} from "../field-source/grid-table-field-source-internal-api";
import { EditableGridLayoutDefinitionColumnTableRecordDefinition, TableRecordDefinition } from '../record-definition/grid-table-record-definition-internal-api';
import { TableRecord } from '../record/grid-table-record-internal-api';
import { EditableGridLayoutDefinitionColumnTableValueSource } from '../value-source/grid-table-value-source-internal-api';
import {
    EditableGridLayoutDefinitionColumnList,
    EditableGridLayoutDefinitionColumnTableRecordSourceDefinition
} from './definition/grid-table-record-source-definition-internal-api';
import { TableRecordSource } from './table-record-source';

/** @public */
export class EditableGridLayoutDefinitionColumnTableRecordSource extends TableRecordSource {
    private readonly _list: EditableGridLayoutDefinitionColumnList;
    private _listChangeEventSubscriptionId: MultiEvent.SubscriptionId;

    constructor(
        textFormatterService: TextFormatterService,
        tableFieldSourceDefinitionRegistryService: TableFieldSourceDefinitionRegistryService,
        tableFieldCustomHeadingsService: TableFieldCustomHeadingsService,
        definition: EditableGridLayoutDefinitionColumnTableRecordSourceDefinition,
    ) {
        super(
            textFormatterService,
            tableFieldSourceDefinitionRegistryService,
            tableFieldCustomHeadingsService,
            definition.typeId,
            EditableGridLayoutDefinitionColumnTableRecordSourceDefinition.allowedFieldSourceDefinitionTypeIds,
        );

        this._list = definition.list;
    }

    get list() { return this._list; }

    override openLocked(opener: LockOpenListItem.Opener) {
        this._listChangeEventSubscriptionId = this._list.subscribeListChangeEvent(
            (listChangeTypeId, idx, count) => this.notifyListChange(listChangeTypeId, idx, count)
        );

        super.openLocked(opener);

        this.setUsable(Badness.notBad); // always usable

        const newCount = this._list.count;
        if (newCount > 0) {
            this.notifyListChange(UsableListChangeTypeId.PreUsableAdd, 0, newCount);
        }
        this.notifyListChange(UsableListChangeTypeId.Usable, 0, 0);
    }

    override closeLocked(opener: LockOpenListItem.Opener) {
        if (this.count > 0) {
            this.notifyListChange(UsableListChangeTypeId.Clear, 0, this.count);
        }

        this._list.unsubscribeListChangeEvent(this._listChangeEventSubscriptionId);

        super.closeLocked(opener);
    }

    override getCount() { return this._list.count; }

    override createDefinition(): EditableGridLayoutDefinitionColumnTableRecordSourceDefinition {
        return new EditableGridLayoutDefinitionColumnTableRecordSourceDefinition(
            this.tableFieldSourceDefinitionRegistryService,
            this._list
        );
    }

    override createRecordDefinition(idx: Integer): EditableGridLayoutDefinitionColumnTableRecordDefinition {
        const record = this._list.records[idx];
        return {
            typeId: TableRecordDefinition.TypeId.GridLayoutDefinitionColumn,
            mapKey: record.fieldName,
            record,
        };
    }

    override createTableRecord(recordIndex: Integer, eventHandlers: TableRecord.EventHandlers): TableRecord {
        const result = new TableRecord(recordIndex, eventHandlers);
        const record = this._list.records[recordIndex];

        const fieldSources = this.activeFieldSources;
        const sourceCount = fieldSources.length;
        for (let i = 0; i < sourceCount; i++) {
            const fieldSource = fieldSources[i];
            const fieldSourceDefinition = fieldSource.definition;
            const fieldSourceDefinitionTypeId = fieldSourceDefinition.typeId as EditableGridLayoutDefinitionColumnTableRecordSourceDefinition.FieldSourceDefinitionTypeId;
            switch (fieldSourceDefinitionTypeId) {
                case TableFieldSourceDefinition.TypeId.EditableGridLayoutDefinitionColumn: {
                    const valueSource = new EditableGridLayoutDefinitionColumnTableValueSource(result.fieldCount, record);
                    result.addSource(valueSource);
                    break;
                }
                default:
                    throw new UnreachableCaseError('GLDCERTRSCTR77752', fieldSourceDefinitionTypeId);
            }
        }

        return result;
    }

    protected override getDefaultFieldSourceDefinitionTypeIds() {
        return EditableGridLayoutDefinitionColumnTableRecordSourceDefinition.defaultFieldSourceDefinitionTypeIds;
    }
}
