/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { Integer, LockOpenListItem, MultiEvent, UsableList, UsableListChangeTypeId } from '../../../sys/sys-internal-api';
import { TextFormatterService } from '../../../text-format/text-format-internal-api';
import { TableRecordSourceDefinitionFactoryService, UsableListTableRecordSourceDefinition } from './definition/grid-table-record-source-definition-internal-api';
import { TableRecordSource } from './table-record-source';

export abstract class UsableListTableRecordSource<Record> extends TableRecordSource {
    readonly list: UsableList<Record>;

    private _listChangeEventSubscriptionId: MultiEvent.SubscriptionId;

    constructor(
        textFormatterService: TextFormatterService,
        tableRecordSourceDefinitionFactoryService: TableRecordSourceDefinitionFactoryService,
        definition: UsableListTableRecordSourceDefinition<Record>,
    ) {
        super(
            textFormatterService,
            tableRecordSourceDefinitionFactoryService,
            definition,
            definition.allowedFieldSourceDefinitionTypeIds,
        );

        this.list = definition.list;
    }

    override openLocked(opener: LockOpenListItem.Opener) {
        this._listChangeEventSubscriptionId = this.list.subscribeListChangeEvent(
            (listChangeTypeId, idx, count) => { this.processListChange(listChangeTypeId, idx, count); }
        );

        super.openLocked(opener);

        if (this.list.usable) {
            const newCount = this.list.count;
            if (newCount > 0) {
                this.processListChange(UsableListChangeTypeId.PreUsableAdd, 0, newCount);
            }
            this.processListChange(UsableListChangeTypeId.Usable, 0, 0);
        } else {
            this.processListChange(UsableListChangeTypeId.Unusable, 0, 0);
        }
    }

    override closeLocked(opener: LockOpenListItem.Opener) {
        // TableRecordDefinitionList can no longer be used after it is deactivated
        if (this.count > 0) {
            this.processListChange(UsableListChangeTypeId.Clear, 0, this.count);
        }

        this.list.unsubscribeListChangeEvent(this._listChangeEventSubscriptionId);
        super.closeLocked(opener);
    }

    protected abstract processListChange(listChangeTypeId: UsableListChangeTypeId, idx: Integer, count: Integer): void;
}
