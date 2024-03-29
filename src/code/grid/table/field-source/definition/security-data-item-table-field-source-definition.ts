/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { PrefixableSecurityDataItemTableFieldSourceDefinition } from './prefixable-security-data-item-table-field-source-definition';
import { TableFieldSourceDefinition } from './table-field-source-definition';

export class SecurityDataItemTableFieldSourceDefinition extends PrefixableSecurityDataItemTableFieldSourceDefinition {
    constructor() {
        super(
            TableFieldSourceDefinition.TypeId.SecurityDataItem,
            SecurityDataItemTableFieldSourceDefinition.fieldNameHeaderPrefix
        );
    }
}

export namespace SecurityDataItemTableFieldSourceDefinition {
    export const fieldNameHeaderPrefix = '';

    export interface FieldId extends PrefixableSecurityDataItemTableFieldSourceDefinition.FieldId {
        sourceTypeId: TableFieldSourceDefinition.TypeId.SecurityDataItem;
    }
}
