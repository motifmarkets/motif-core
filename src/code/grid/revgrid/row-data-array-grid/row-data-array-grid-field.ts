/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { RenderValue } from '../../../services/services-internal-api';
import { AssertInternalError, IndexedRecord } from '../../../sys/sys-internal-api';
import { GridField } from '../../field/grid-field-internal-api';

export class RowDataArrayGridField extends GridField {
    override getViewValue(_record: IndexedRecord): RenderValue {
        throw new AssertInternalError('RDAGFGVV22211'); // not used in RowDataArray grids
    }
}
