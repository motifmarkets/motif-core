/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { MultiEvent } from '../sys/sys-internal-api';
import { BooleanUiAction } from './boolean-ui-action';
import { ButtonUiAction } from './button-ui-action';

export class IconButtonUiAction extends ButtonUiAction {

    private _iconId: IconButtonUiAction.IconId;

    private _iconButtonPushMultiEvent = new MultiEvent<IconButtonUiAction.PushEventHandlersInterface>();

    get iconId() { return this._iconId; }

    initialiseIcon(iconId: IconButtonUiAction.IconId) {
        this._iconId = iconId;
    }

    pushIcon(iconId: IconButtonUiAction.IconId) {
        this._iconId = iconId;
        this.notifyIconPush();
    }

    override subscribePushEvents(handlersInterface: IconButtonUiAction.PushEventHandlersInterface) {
        const subscriptionId = super.subscribePushEvents(handlersInterface);
        return this._iconButtonPushMultiEvent.subscribeWithId(handlersInterface, subscriptionId);
    }

    override unsubscribePushEvents(subscriptionId: MultiEvent.SubscriptionId) {
        this._iconButtonPushMultiEvent.unsubscribe(subscriptionId);
        super.unsubscribePushEvents(subscriptionId);
    }

    private notifyIconPush() {
        const handlersInterfaces = this._iconButtonPushMultiEvent.copyHandlers();
        for (let i = 0; i < handlersInterfaces.length; i++) {
            const handlersInterface = handlersInterfaces[i];
            if (handlersInterface.icon !== undefined) {
                handlersInterface.icon(this.iconId);
            }
        }
    }
}

export namespace IconButtonUiAction {
    // export namespace Icon {
    //     export const LightStyle = 'fal';
    //     export const CalendarTimes = 'calendar-times';
    //     export const CalendarAlt = 'calendar-alt';
    //     export const CalendarMinus = 'calendar-minus';
    //     export const Info = 'info';
    //     export const Bolt = 'bolt';
    // }

    export const enum IconId {
        Blankest,
        PrimaryDitemFrame,
        SymbolLink,
        AccountGroupLink,
        SubWindowReturn,
        CopyToClipboard,
        Execute,
        BuyOrderPad,
        SellOrderPad,
        AmendOrderPad,
        CancelOrderPad,
        MoveOrderPad,
        SelectColumns,
        AutoSizeColumnWidths,
        RollUp,
        RollDown,
        Filter,
        Save,
        DeleteSymbol,
        NewWatchlist,
        OpenWatchlist,
        SaveWatchlist,
        Lighten,
        Darken,
        Brighten,
        Complement,
        Saturate,
        Desaturate,
        SpinColor,
        CopyColor,
        ReturnOk,
        ReturnCancel,
        SearchNext,
        CancelSearch,
        MoveUp,
        MoveToTop,
        MoveDown,
        MoveToBottom,
        NotHistorical,
        Historical,
        HistoricalCompare,
        Details,
        ToggleSearchTermNotExchangedMarketProcessed,
    }

    export type iconPushEventHandler = (this: void, iconId: IconButtonUiAction.IconId) => void;

    export interface PushEventHandlersInterface extends BooleanUiAction.PushEventHandlersInterface {
        icon?: iconPushEventHandler;
    }
}
