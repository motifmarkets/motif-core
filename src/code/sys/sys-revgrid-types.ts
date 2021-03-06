/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

// Alias for RevRecordValueRecentChangeTypeId (so that revgrid is only imported here for adi and sys)

import { RevRecordValueRecentChangeTypeId } from 'revgrid';

/** @public */
export type ValueRecentChangeTypeId = RevRecordValueRecentChangeTypeId;

/** @public */
export namespace ValueRecentChangeTypeId {
    export const Update = RevRecordValueRecentChangeTypeId.Update;
    export const Increase = RevRecordValueRecentChangeTypeId.Increase;
    export const Decrease = RevRecordValueRecentChangeTypeId.Decrease;
}
