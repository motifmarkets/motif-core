/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { Badness, Integer, LockOpenListItem, MultiEvent, UnreachableCaseError, UsableListChangeTypeId } from '../../../sys/sys-internal-api';
import { TextFormatterService } from '../../../text-format/text-format-internal-api';
import {
    TableFieldSourceDefinition
} from "../field-source/grid-table-field-source-internal-api";
import { TableField } from '../field/grid-table-field-internal-api';
import { EditableGridLayoutDefinitionColumn, EditableGridLayoutDefinitionColumnTableRecordDefinition, TableRecordDefinition } from '../record-definition/grid-table-record-definition-internal-api';
import { TableRecord } from '../record/grid-table-record-internal-api';
import { EditableGridLayoutDefinitionColumnTableValueSource } from '../value-source/internal-api';
import {
    EditableGridLayoutDefinitionColumnList,
    EditableGridLayoutDefinitionColumnTableRecordSourceDefinition,
    TableRecordSourceDefinitionFactoryService
} from './definition/grid-table-record-source-definition-internal-api';
import { TableRecordSource } from './table-record-source';

/** @public */
export class EditableGridLayoutDefinitionColumnTableRecordSource extends TableRecordSource {
    private readonly _list: EditableGridLayoutDefinitionColumnList;
    private readonly _records: readonly EditableGridLayoutDefinitionColumn[];
    private _listChangeEventSubscriptionId: MultiEvent.SubscriptionId;

    constructor(
        textFormatterService: TextFormatterService,
        tableRecordSourceDefinitionFactoryService: TableRecordSourceDefinitionFactoryService,
        definition: EditableGridLayoutDefinitionColumnTableRecordSourceDefinition,
    ) {
        super(
            textFormatterService,
            tableRecordSourceDefinitionFactoryService,
            definition,
            EditableGridLayoutDefinitionColumnTableRecordSourceDefinition.allowedFieldSourceDefinitionTypeIds,
        );

        this._list = definition.list;
        this._records = this._list.records;
    }

    get list() { return this._list; }

    override openLocked(opener: LockOpenListItem.Opener) {
        this._listChangeEventSubscriptionId = this._list.subscribeListChangeEvent(
            (listChangeTypeId, idx, count) => { this.notifyListChange(listChangeTypeId, idx, count); }
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
        return this.tableRecordSourceDefinitionFactoryService.createEditableGridLayoutDefinitionColumn(this._list);
    }

    override createRecordDefinition(idx: Integer): EditableGridLayoutDefinitionColumnTableRecordDefinition {
        const record = this._records[idx];
        return {
            typeId: TableRecordDefinition.TypeId.GridLayoutDefinitionColumn,
            mapKey: record.fieldName,
            record,
        };
    }

    override createTableRecord(recordIndex: Integer, eventHandlers: TableRecord.EventHandlers): TableRecord {
        const result = new TableRecord(recordIndex, eventHandlers);
        const record = this._records[recordIndex];

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

    protected override createFields(): TableField[] {
        const fields = super.createFields();
        for (const field of fields) {
            if (field.definition.sourcelessName === EditableGridLayoutDefinitionColumn.FieldName.visible) {
                field.getEditValueEventer = (tableRecord) => {
                    const index = tableRecord.index;
                    const record = this._records[index];
                    return record.visible;
                }
                field.setEditValueEventer = (tableRecord, value) => {
                    const index = tableRecord.index;
                    const record = this._records[index];
                    record.visible = value as boolean;
                }
            } else {
                if (field.definition.sourcelessName === EditableGridLayoutDefinitionColumn.FieldName.width) {
                    field.getEditValueEventer = (tableRecord) => {
                        const index = tableRecord.index;
                        const record = this._records[index];
                        return record.width;
                    }
                    field.setEditValueEventer = (tableRecord, value) => {
                        const index = tableRecord.index;
                        const record = this._records[index];
                        record.width = value as Integer | undefined;
                    }
                }
            }
        }
        return fields;
    }
}
