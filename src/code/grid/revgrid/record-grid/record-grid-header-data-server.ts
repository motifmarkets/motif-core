/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { DataServer } from 'revgrid';
import { GridField } from '../../field/grid-field-internal-api';

export class RecordGridHeaderDataServer implements DataServer<GridField> {
    private _dataCallbackListener: DataServer.NotificationsClient;

    subscribeDataNotifications(value: DataServer.NotificationsClient): void {
        this._dataCallbackListener = value;
    }

    getViewValue(field: GridField, _rowCount: number): string {
        return field.heading;
    }

    getRowCount() {
        return 1;
    }

    invalidateCell(schemaColumnIndex: number, rowIndex = 0) {
        this._dataCallbackListener.invalidateCell(schemaColumnIndex, rowIndex);
    }
}