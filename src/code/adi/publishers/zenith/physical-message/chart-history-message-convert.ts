/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { AssertInternalError, ErrorCode, ZenithDataError } from '../../../../sys/sys-internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    ChartHistoryDataMessage,
    QueryChartHistoryDataDefinition
} from "../../../common/adi-common-internal-api";
import { Zenith } from './zenith';
import { ZenithConvert } from './zenith-convert';

/** @internal */
export namespace ChartHistoryMessageConvert {

    export function createRequestMessage(request: AdiPublisherRequest) {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof QueryChartHistoryDataDefinition) {
            return createPublishMessage(definition);
        } else {
            throw new AssertInternalError('CHOMCCRM55583399', definition.description);
        }
    }

    function createPublishMessage(definition: QueryChartHistoryDataDefinition) {
        const litIvemId = definition.litIvemId;
        const marketId = litIvemId.litId;
        const dataEnvironmentId = litIvemId.environmentId;
        const period = ZenithConvert.ChartHistory.Period.fromChartIntervalId(definition.intervalId);
        let fromDate: Zenith.DateTimeIso8601 | undefined;
        if (definition.fromDate === undefined) {
            fromDate = undefined;
        } else {
            fromDate = ZenithConvert.Date.DateTimeIso8601.fromDate(definition.fromDate);
        }
        let toDate: Zenith.DateTimeIso8601 | undefined;
        if (definition.toDate === undefined) {
            toDate = undefined;
        } else {
            toDate = ZenithConvert.Date.DateTimeIso8601.fromDate(definition.toDate);
        }

        const result: Zenith.MarketController.ChartHistory.PublishMessageContainer = {
            Controller: Zenith.MessageContainer.Controller.Market,
            Topic: Zenith.MarketController.TopicName.QueryChartHistory,
            Action: Zenith.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                Code: definition.litIvemId.code,
                Market: ZenithConvert.EnvironmentedMarket.fromId(marketId, dataEnvironmentId),
                Count: definition.count,
                Period: period,
                FromDate: fromDate,
                ToDate: toDate,
            }
        };

        return result;
    }

    export function parseMessage(subscription: AdiPublisherSubscription, message: Zenith.MessageContainer,
            actionId: ZenithConvert.MessageContainer.Action.Id) {
        if (message.Controller !== Zenith.MessageContainer.Controller.Market) {
            throw new ZenithDataError(ErrorCode.CHMCPMC588329999199, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.CHMCPMA2233498, actionId.toString());
            } else {
                if (message.Topic !== Zenith.MarketController.TopicName.QueryChartHistory) {
                    throw new ZenithDataError(ErrorCode.CHMCPMT2233498, message.Topic);
                } else {
                    const historyMsg = message as Zenith.MarketController.ChartHistory.PayloadMessageContainer;

                    const dataMessage = new ChartHistoryDataMessage();
                    dataMessage.dataItemId = subscription.dataItemId;
                    dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                    dataMessage.records = parseData(historyMsg.Data);
                    return dataMessage;
                }
            }
        }
    }

    function parseData(payloadRecords: Zenith.MarketController.ChartHistory.Record[]): ChartHistoryDataMessage.Record[] {
        const count = payloadRecords.length;
        const records = new Array<ChartHistoryDataMessage.Record>(count);
        for (let i = 0; i < count; i++) {
            const payloadRecord = payloadRecords[i];
            const dateTime = ZenithConvert.Date.DateTimeIso8601.toSourceTzOffsetDateTime(payloadRecord.Date);
            if (dateTime === undefined) {
                throw new ZenithDataError(ErrorCode.CHMCPD87777354332, payloadRecord.Date);
            } else {
                const record: ChartHistoryDataMessage.Record = {
                    dateTime,
                    open: payloadRecord.Open,
                    high: payloadRecord.High,
                    low: payloadRecord.Low,
                    close: payloadRecord.Close,
                    volume: payloadRecord.Volume,
                    trades: payloadRecord.Trades,
                };

                records[i] = record;
            }
        }

        return records;
    }
}
