/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { BehavioredColumnSettings } from '@xilytix/revgrid';
import { AdaptedRevgridColumnSettings } from './adapted-revgrid-column-settings';

/** @public */
export interface AdaptedRevgridBehavioredColumnSettings extends AdaptedRevgridColumnSettings, BehavioredColumnSettings {
    merge(settings: Partial<AdaptedRevgridColumnSettings>): boolean;
    clone(): AdaptedRevgridBehavioredColumnSettings;
}
