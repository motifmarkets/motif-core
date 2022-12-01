/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { GridFieldHAlign } from '../../../sys/sys-internal-api';
import { GridFieldDefinition, GridFieldSourceDefinition } from '../../field/grid-field-internal-api';
import { TableValue } from '../value/grid-table-value-internal-api';
import { TableField } from './table-field';

export class TableFieldDefinition extends GridFieldDefinition {
    constructor(
        name: string,
        heading: string,
        textAlign: GridFieldHAlign,
        source: GridFieldSourceDefinition,
        readonly sourcelessName: string,
        readonly gridFieldConstructor: TableField.Constructor,
        readonly gridValueConstructor: TableValue.Constructor,

    ) {
        super(name, heading, textAlign, source);
    }
}