/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { GridFieldHAlign } from '../../sys/sys-internal-api';
import { GridFieldSourceDefinition } from './grid-field-source-definition';

export class GridFieldDefinition {
    constructor(
        readonly name: string,
        public heading: string,
        readonly textAlign: GridFieldHAlign,
        readonly source: GridFieldSourceDefinition,
    ) {

    }
}