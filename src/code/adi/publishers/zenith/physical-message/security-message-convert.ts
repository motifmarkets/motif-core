/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { Decimal } from 'decimal.js-light';
import {
    AssertInternalError,
    ErrorCode,
    getUndefinedNullOrFunctionResult,
    ifDefined,
    newUndefinableDecimal,
    ThrowableError,
    UnexpectedCaseError,
    ZenithDataError
} from "../../../../sys/sys-internal-api";
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataEnvironmentId,
    EnvironmentedExchangeId,
    ExchangeId,
    MarketId,
    QuerySecurityDataDefinition,
    SecurityDataDefinition,
    SecurityDataMessage
} from "../../../common/adi-common-internal-api";
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export namespace SecurityMessageConvert {

    export function createRequestMessage(request: AdiPublisherRequest) {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof SecurityDataDefinition) {
            return createSubUnsubMessage(definition, request.typeId);
        } else {
            if (definition instanceof QuerySecurityDataDefinition) {
                return createPublishMessage(definition);
            } else {
                throw new AssertInternalError('SMCCRM1111999428', definition.description);
            }
        }
    }

    function createPublishMessage(definition: QuerySecurityDataDefinition) {
        const litIvemId = definition.litIvemId;
        const marketId = litIvemId.litId;
        const dataEnvironmentId = litIvemId.environmentId;

        const result: ZenithProtocol.MarketController.Security.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Market,
            Topic: ZenithProtocol.MarketController.TopicName.QuerySecurity,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                Market: ZenithConvert.EnvironmentedMarket.fromId(marketId, dataEnvironmentId),
                Code: definition.litIvemId.code,
            }
        };

        return result;
    }

    function createSubUnsubMessage(definition: SecurityDataDefinition, requestTypeId: AdiPublisherRequest.TypeId) {
        const topic = ZenithProtocol.MarketController.TopicName.Security + ZenithProtocol.topicArgumentsAnnouncer +
            ZenithConvert.Symbol.fromId(definition.litIvemId);

        const result: ZenithProtocol.SubUnsubMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Market,
            Topic: topic,
            Action: ZenithConvert.MessageContainer.Action.fromRequestTypeId(requestTypeId),
        };

        return result;
    }

    export function parseMessage(subscription: AdiPublisherSubscription, message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id) {

        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Market) {
            throw new ZenithDataError(ErrorCode.SMCPMC699483333434, message.Controller);
        } else {
            const dataMessage = new SecurityDataMessage();
            dataMessage.dataItemId = subscription.dataItemId;
            dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
            switch (actionId) {
                case ZenithConvert.MessageContainer.Action.Id.Publish:
                    if (message.Topic !== ZenithProtocol.MarketController.TopicName.QuerySecurity) {
                        throw new ZenithDataError(ErrorCode.SMCPMP11995543833, message.Topic);
                    } else {
                        const publishMsg = message as ZenithProtocol.MarketController.Security.PayloadMessageContainer;
                        dataMessage.securityInfo = parseData(publishMsg.Data);
                    }
                    break;
                case ZenithConvert.MessageContainer.Action.Id.Sub:
                    if (!message.Topic.startsWith(ZenithProtocol.MarketController.TopicName.Security)) {
                        throw new ZenithDataError(ErrorCode.SMCPMS55845845454, message.Topic);
                    } else {
                        const subMsg = message as ZenithProtocol.MarketController.Security.PayloadMessageContainer;
                        dataMessage.securityInfo = parseData(subMsg.Data);
                    }
                    break;
                default:
                    throw new UnexpectedCaseError('SMCPMD559324888222', actionId.toString(10));
            }

            return dataMessage;
        }
    }

    function parseData(data: ZenithProtocol.MarketController.Security.Payload): SecurityDataMessage.Rec {
        let marketId: MarketId | undefined;
        let exchangeId: ExchangeId | undefined;
        let environmentId: DataEnvironmentId | undefined;
        const dataMarket = data.Market;
        if (dataMarket === undefined) {
            marketId = undefined;
            environmentId = undefined;
        } else {
            const environmentedMarketId = ZenithConvert.EnvironmentedMarket.toId(dataMarket);
            marketId = environmentedMarketId.marketId;
            environmentId = environmentedMarketId.environmentId;
        }

        let environmentedExchangeId: EnvironmentedExchangeId | undefined;
        if (data.Exchange !== undefined) {
            environmentedExchangeId = ZenithConvert.EnvironmentedExchange.toId(data.Exchange);
        } else {
            if (dataMarket !== undefined) {
                environmentedExchangeId = ZenithConvert.EnvironmentedExchange.toId(dataMarket);
            } else {
                environmentedExchangeId = undefined;
            }
        }
        if (environmentedExchangeId === undefined) {
            exchangeId = undefined;
        } else {
            exchangeId = environmentedExchangeId.exchangeId;
            environmentId = environmentedExchangeId.environmentId;
        }

        const extended = data.Extended;

        try {
            const result: SecurityDataMessage.Rec = {
                code: data.Code,
                marketId,
                exchangeId,
                dataEnvironmentId: environmentId,
                name: data.Name,
                classId: ifDefined(data.Class, x => ZenithConvert.IvemClass.toId(x)),
                cfi: data.CFI,
                tradingState: data.TradingState,
                marketIds: ifDefined(data.TradingMarkets, parseTradingMarkets),
                isIndex: data.IsIndex === true,
                expiryDate: ifDefined(data.ExpiryDate, x => ZenithConvert.Date.DateYYYYMMDD.toSourceTzOffsetDate(x)),
                strikePrice: newUndefinableDecimal(data.StrikePrice),
                callOrPutId: ifDefined(data.CallOrPut, x => ZenithConvert.CallOrPut.toId(x)),
                contractSize: data.ContractSize,
                subscriptionDataIds: ifDefined(data.SubscriptionData, x => ZenithConvert.SubscriptionData.toIdArray(x)),
                quotationBasis: data.QuotationBasis,
                open: getUndefinedNullOrFunctionResult(data.Open, x => new Decimal(x)),
                high: getUndefinedNullOrFunctionResult(data.High, x => new Decimal(x)),
                low: getUndefinedNullOrFunctionResult(data.Low, x => new Decimal(x)),
                close: getUndefinedNullOrFunctionResult(data.Close, x => new Decimal(x)),
                settlement: getUndefinedNullOrFunctionResult(data.Settlement, x => new Decimal(x)),
                last: getUndefinedNullOrFunctionResult(data.Last, x => new Decimal(x)),
                trend: ifDefined(data.Trend, x => ZenithConvert.Trend.toId(x)),
                bestAsk: getUndefinedNullOrFunctionResult(data.BestAsk, x => new Decimal(x)),
                askCount: data.AskCount,
                askQuantity: data.AskQuantity,
                askUndisclosed: data.AskUndisclosed,
                bestBid: getUndefinedNullOrFunctionResult(data.BestBid, x => new Decimal(x)),
                bidCount: data.BidCount,
                bidQuantity: data.BidQuantity,
                bidUndisclosed: data.BidUndisclosed,
                numberOfTrades: data.NumberOfTrades,
                volume: data.Volume,
                auctionPrice: getUndefinedNullOrFunctionResult(data.AuctionPrice, x => new Decimal(x)),
                auctionQuantity: data.AuctionQuantity,
                auctionRemainder: data.AuctionRemainder,
                vWAP: getUndefinedNullOrFunctionResult(data.VWAP, x => new Decimal(x)),
                valueTraded: data.ValueTraded,
                openInterest: data.OpenInterest,
                shareIssue: data.ShareIssue,
                statusNote: data.StatusNote,
                extended: getUndefinedNullOrFunctionResult(extended, value => ZenithConvert.Security.Extended.toAdi(value)),
            } as const;
            return result;
        } catch (error) {
            throw ThrowableError.prependErrorMessage(error, 'Security Data Message: ');
        }
    }

    function parseTradingMarkets(tradingMarkets: string[]): MarketId[] {
        return tradingMarkets.map(tm => ZenithConvert.EnvironmentedMarket.toId(tm).marketId);
    }
}
