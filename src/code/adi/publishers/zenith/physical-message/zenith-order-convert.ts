/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { Decimal } from 'decimal.js-light';
import { AssertInternalError, ErrorCode, newUndefinableDecimal, UnreachableCaseError, ZenithDataError } from '../../../../sys/sys-internal-api';
import {
    AurcChangeTypeId, BestMarketOrderRoute, FixOrderRoute,
    IvemClassId, MarketBoardId, MarketId, MarketOrderRoute,
    OrdersDataMessage
} from '../../../common/adi-common-internal-api';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export namespace ZenithOrderConvert {
    export function toChange(typeId: AurcChangeTypeId, order: ZenithProtocol.TradingController.Orders.Order): OrdersDataMessage.Change {
        switch (typeId) {
            case AurcChangeTypeId.Add: {
                const addChange = new OrdersDataMessage.AddChange();
                loadAddUpdateChange(addChange, order as ZenithProtocol.TradingController.Orders.AddUpdateOrder);
                return addChange;
            }
            case AurcChangeTypeId.Update: {
                const updateChange = new OrdersDataMessage.UpdateChange();
                loadAddUpdateChange(updateChange, order as ZenithProtocol.TradingController.Orders.AddUpdateOrder);
                return updateChange;
            }
            case AurcChangeTypeId.Remove: {
                const removeChange = new OrdersDataMessage.RemoveChange();
                removeChange.accountId = order.Account;
                loadRemoveChange(removeChange, order as ZenithProtocol.TradingController.Orders.RemoveOrder);
                return removeChange;
            }
            case AurcChangeTypeId.Clear: {
                throw new AssertInternalError('ZOCTCC11193427738');
            }
            default:
                throw new UnreachableCaseError('ZOCTCD343918842701', typeId);
        }
    }

    export function toAddChange(order: ZenithProtocol.TradingController.Orders.AddUpdateOrder) {
        const change = new OrdersDataMessage.AddChange();
        loadAddUpdateChange(change, order);
        return change;
    }

    export function toAddUpdateChange(order: ZenithProtocol.TradingController.Orders.AddUpdateOrder) {
        const change = new OrdersDataMessage.AddUpdateChange();
        loadAddUpdateChange(change, order);
        return change;
    }

    function loadRemoveChange(change: OrdersDataMessage.RemoveChange, value: ZenithProtocol.TradingController.Orders.RemoveOrder) {
        const environmentedAccountId = ZenithConvert.EnvironmentedAccount.toId(value.Account);
        change.accountId = environmentedAccountId.accountId;
        change.id = value.ID;
    }

    function loadAddUpdateChange(change: OrdersDataMessage.AddUpdateChange, order: ZenithProtocol.TradingController.Orders.AddUpdateOrder) {
        loadChange(change, order);
        switch (order.Style) {
            case ZenithProtocol.TradingController.OrderStyle.Unknown:
                throw new ZenithDataError(ErrorCode.ZOCTOU2243629458, JSON.stringify(order).substr(0, 200));
            case ZenithProtocol.TradingController.OrderStyle.Market:
                loadMarketOrder(change, order as ZenithProtocol.TradingController.Orders.MarketOrder);
                break;
            case ZenithProtocol.TradingController.OrderStyle.ManagedFund:
                loadManagedFundOrder(change, order as ZenithProtocol.TradingController.Orders.ManagedFundOrder);
                break;
            default:
                throw new UnreachableCaseError('ZCTO3399851', order.Style);
        }

        return change;
    }

    function loadMarketOrder(change: OrdersDataMessage.AddUpdateChange, order: ZenithProtocol.TradingController.Orders.MarketOrder) {
        change.styleId = IvemClassId.Market;
        change.executedQuantity = order.ExecutedQuantity;
        if (order.AveragePrice === undefined) {
            change.averagePrice = undefined;
        } else {
            if (order.AveragePrice === null) {
                change.averagePrice = null;
            } else {
                change.averagePrice = new Decimal(order.AveragePrice);
            }
        }
    }

    function loadManagedFundOrder(change: OrdersDataMessage.AddUpdateChange, order: ZenithProtocol.TradingController.Orders.ManagedFundOrder) {
        change.styleId = IvemClassId.ManagedFund;
    }

    function loadChange(change: OrdersDataMessage.AddUpdateChange, order: ZenithProtocol.TradingController.Orders.AddUpdateOrder) {
        let marketId: MarketId | undefined;
        let marketBoardId: MarketBoardId | undefined;

        const environmentedAccountId = ZenithConvert.EnvironmentedAccount.toId(order.Account);
        const accountId = environmentedAccountId.accountId;
        const environmentId = environmentedAccountId.environmentId;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (order.Market === undefined) {
            marketId = undefined;
        } else {
            const environmentedMarketId = ZenithConvert.EnvironmentedMarket.toId(order.Market);
            marketId = environmentedMarketId.marketId;
            // environmentId = environmentedMarketId.environmentId;
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (order.TradingMarket === undefined) {
            marketBoardId = undefined;
        } else {
            const environmentedMarketBoardId = ZenithConvert.EnvironmentedMarketBoard.toId(order.TradingMarket);
            marketBoardId = environmentedMarketBoardId.marketBoardId;
            // environmentId = environmentedMarketBoardId.environmentId;
        }

        const createdDate  = ZenithConvert.Date.DateTimeIso8601.toSourceTzOffsetDateTime(order.CreatedDate);
        if (createdDate === undefined) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            throw new ZenithDataError(ErrorCode.ZOCLOC1052883977, order.CreatedDate ?? '');
        } else {
            const updatedDate = ZenithConvert.Date.DateTimeIso8601.toSourceTzOffsetDateTime(order.UpdatedDate);
            if (updatedDate === undefined) {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                throw new ZenithDataError(ErrorCode.ZOCLOU1052883977, order.CreatedDate ?? '');
            } else {
                change.id = order.ID;
                change.accountId = accountId;
                change.environmentId = environmentId;
                change.externalId = order.ExternalID;
                change.depthOrderId = order.DepthOrderID;
                change.status = order.Status;
                change.marketId = marketId;
                change.marketBoardId = marketBoardId;
                change.currencyId = ZenithConvert.Currency.tryToId(order.Currency);
                change.estimatedBrokerage = new Decimal(order.EstimatedBrokerage);
                change.currentBrokerage = new Decimal(order.CurrentBrokerage);
                change.estimatedTax = new Decimal(order.EstimatedTax);
                change.currentTax = new Decimal(order.CurrentTax);
                change.currentValue = new Decimal(order.CurrentValue);
                change.createdDate = createdDate;
                change.updatedDate = updatedDate;
                change.children = order.Children;
                loadOrderDetails(change, order.Details);
                loadOrderRoute(change, order.Route);
                loadOrderCondition(change, order.Condition);
            }
        }
    }

    function loadOrderDetails(order: OrdersDataMessage.AddUpdateChange, value: ZenithProtocol.TradingController.PlaceOrder.Details) {
        const environmentedExchangeId = ZenithConvert.EnvironmentedExchange.toId(value.Exchange);
        order.exchangeId = environmentedExchangeId.exchangeId;
        order.code = value.Code;
        order.sideId = ZenithConvert.OrderSide.toId(value.Side);
        order.brokerageSchedule = value.BrokerageSchedule;
        order.instructionIds = ZenithConvert.OrderInstruction.toIdArray(value.Instructions);

        switch (value.Style) {
            case ZenithProtocol.TradingController.OrderStyle.Unknown:
                throw new ZenithDataError(ErrorCode.ZOCLODU87873991318, JSON.stringify(value).substr(0, 200));
            case ZenithProtocol.TradingController.OrderStyle.Market:
                return loadMarketOrderDetails(order, value as ZenithProtocol.TradingController.PlaceOrder.MarketDetails);
            case ZenithProtocol.TradingController.OrderStyle.ManagedFund:
                return loadManagedFundOrderDetails(order, value as ZenithProtocol.TradingController.PlaceOrder.ManagedFundDetails);
            default: throw new UnreachableCaseError('ZOCTOD44855', value.Style);
        }
    }

    function loadMarketOrderDetails(order: OrdersDataMessage.AddUpdateChange, value: ZenithProtocol.TradingController.PlaceOrder.MarketDetails) {
        // order.styleId = OrderStyleId.Market; // done in MarketOrder class
        order.equityOrderTypeId = ZenithConvert.EquityOrderType.toId(value.Type);
        order.limitPrice = newUndefinableDecimal(value.LimitPrice);
        order.quantity = value.Quantity;
        order.hiddenQuantity = value.HiddenQuantity;
        order.minimumQuantity = value.MinimumQuantity;
        order.timeInForceId = ZenithConvert.EquityOrderValidity.toId(value.Validity);
        const expiryDate = value.ExpiryDate;
        order.expiryDate = expiryDate === undefined ? undefined : ZenithConvert.Date.DateTimeIso8601.toSourceTzOffsetDateTime(expiryDate);
        const shortType = value.ShortType;
        order.shortSellTypeId = shortType === undefined ? undefined : ZenithConvert.ShortSellType.toId(shortType);
    }

    function loadManagedFundOrderDetails(order: OrdersDataMessage.AddUpdateChange,
            value: ZenithProtocol.TradingController.PlaceOrder.ManagedFundDetails) {
        // order.styleId = OrderStyleId.ManagedFund; // done in ManagedFundOrder class
        order.unitTypeId = ZenithConvert.OrderPriceUnitType.toId(value.UnitType);
        order.unitAmount = new Decimal(value.UnitAmount);
        order.managedFundCurrency = value.Currency;
        order.physicalDelivery = value.PhysicalDelivery;
    }

    function loadOrderRoute(order: OrdersDataMessage.AddUpdateChange, value: ZenithProtocol.TradingController.PlaceOrder.Route) {
        switch (value.Algorithm) {
            case ZenithProtocol.OrderRouteAlgorithm.Market:
                return loadMarketOrderRoute(order, value as ZenithProtocol.TradingController.PlaceOrder.MarketRoute);
            case ZenithProtocol.OrderRouteAlgorithm.BestMarket:
                return loadBestMarketOrderRoute(order, value as ZenithProtocol.TradingController.PlaceOrder.BestMarketRoute);
            case ZenithProtocol.OrderRouteAlgorithm.Fix:
                return loadFixOrderRoute(order, value as ZenithProtocol.TradingController.PlaceOrder.FixRoute);
            default: throw new UnreachableCaseError('ZCTOR33872', value.Algorithm);
        }
    }

    function loadMarketOrderRoute(order: OrdersDataMessage.AddUpdateChange, value: ZenithProtocol.TradingController.PlaceOrder.MarketRoute) {
        const environmentedMarketId = ZenithConvert.EnvironmentedMarket.toId(value.Market);
        const marketId = environmentedMarketId.marketId;
        order.route = new MarketOrderRoute(marketId);
    }

    function loadBestMarketOrderRoute(order: OrdersDataMessage.AddUpdateChange,
            value: ZenithProtocol.TradingController.PlaceOrder.BestMarketRoute) {
        order.route = new BestMarketOrderRoute();
    }

    function loadFixOrderRoute(order: OrdersDataMessage.AddUpdateChange, value: ZenithProtocol.TradingController.PlaceOrder.FixRoute) {
        order.route = new FixOrderRoute();
    }

    function loadOrderCondition(order: OrdersDataMessage.AddUpdateChange, value?: ZenithProtocol.TradingController.PlaceOrder.Condition) {
        order.trigger = ZenithConvert.PlaceOrderCondition.toOrderTrigger(value);
    }
}
