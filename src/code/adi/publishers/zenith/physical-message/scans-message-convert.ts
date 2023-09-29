/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import {
    AssertInternalError, ErrorCode, UnreachableCaseError, ZenithDataError
} from '../../../../sys/sys-internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    AurcChangeTypeId,
    QueryScanDescriptorsDataDefinition,
    ScanDescriptorsDataMessage,
    WatchmakerListDescriptorsDataDefinition
} from "../../../common/adi-common-internal-api";
import { Zenith } from './zenith';
import { ZenithConvert } from './zenith-convert';
import { ZenithNotifyConvert } from './zenith-notify-convert';

export namespace ScansMessageConvert {
    export function createRequestMessage(request: AdiPublisherRequest) {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof WatchmakerListDescriptorsDataDefinition) {
            return createSubUnsubMessage(request.typeId);
        } else {
            if (definition instanceof QueryScanDescriptorsDataDefinition) {
                return createPublishMessage();
            } else {
                throw new AssertInternalError('SMCCRM70324', definition.description);
            }
        }
    }

    function createPublishMessage() {
        const result: Zenith.NotifyController.Scans.PublishMessageContainer = {
            Controller: Zenith.MessageContainer.Controller.Notify,
            Topic: Zenith.NotifyController.TopicName.QueryScans,
            Action: Zenith.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
        };

        return result;
    }

    function createSubUnsubMessage(requestTypeId: AdiPublisherRequest.TypeId) {
        const topic = Zenith.NotifyController.TopicName.Scans;

        const result: Zenith.SubUnsubMessageContainer = {
            Controller: Zenith.MessageContainer.Controller.Notify,
            Topic: topic,
            Action: ZenithConvert.MessageContainer.Action.fromRequestTypeId(requestTypeId),
        };

        return result;
    }

    export function parseMessage(subscription: AdiPublisherSubscription, message: Zenith.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id) {

        if (message.Controller !== Zenith.MessageContainer.Controller.Notify) {
            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Scans_Controller, message.Controller);
        } else {
            let payloadMsg: Zenith.NotifyController.Scans.PayloadMessageContainer;
            switch (actionId) {
                case ZenithConvert.MessageContainer.Action.Id.Publish:
                    if (message.Topic !== Zenith.NotifyController.TopicName.QueryScans) {
                        throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Scans_PublishTopic, message.Topic);
                    } else {
                        payloadMsg = message as Zenith.NotifyController.Scans.PayloadMessageContainer;
                    }
                    break;
                case ZenithConvert.MessageContainer.Action.Id.Sub:
                    if (!message.Topic.startsWith(Zenith.NotifyController.TopicName.Scans)) {
                        throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Scans_SubTopic, message.Topic);
                    } else {
                        payloadMsg = message as Zenith.NotifyController.Scans.PayloadMessageContainer;
                    }
                    break;
                default:
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Scans_Action, JSON.stringify(message));
            }

            const dataMessage = new ScanDescriptorsDataMessage();
            dataMessage.dataItemId = subscription.dataItemId;
            dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
            dataMessage.changes = parseData(payloadMsg.Data);
            return dataMessage;
        }
    }

    function parseData(data: readonly Zenith.NotifyController.ScanChange[]): ScanDescriptorsDataMessage.Change[] {
        const count = data.length;
        const result = new Array<ScanDescriptorsDataMessage.Change>(count);
        for (let i = 0; i < count; i++) {
            const scanChange = data[i];
            result[i] = parseScanChange(scanChange);
        }
        return result;
    }

    function parseScanChange(value: Zenith.NotifyController.ScanChange): ScanDescriptorsDataMessage.Change {
        const changeTypeId = ZenithConvert.AurcChangeType.toId(value.Operation);
        switch (changeTypeId) {
            case AurcChangeTypeId.Add:
            case AurcChangeTypeId.Update: {
                const scan = value.Scan;
                if (scan === undefined) {
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Scans_AddUpdateMissingScan, JSON.stringify(value));
                } else {
                    const metaData = ZenithNotifyConvert.ScanMetaType.to(scan.MetaData);
                    const change: ScanDescriptorsDataMessage.AddUpdateChange = {
                        typeId: changeTypeId,
                        id: scan.ID,
                        name: scan.Name,
                        description: scan.Description,
                        versionId: metaData.versionId,
                        lastSavedTime: metaData.lastSavedTime,
                        isWritable: scan.IsWritable,
                    };
                    return change;
                }
            }
            case AurcChangeTypeId.Remove: {
                const scan = value.Scan;
                if (scan === undefined) {
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Scans_RemoveMissingScan, JSON.stringify(value));
                } else {
                    const change: ScanDescriptorsDataMessage.RemoveChange = {
                        typeId: changeTypeId,
                        id: scan.ID,
                    };
                    return change;
                }
            }
            case AurcChangeTypeId.Clear: {
                const change: ScanDescriptorsDataMessage.ClearChange = {
                    typeId: changeTypeId,
                }
                return change;
            }
            default:
                throw new UnreachableCaseError('SMCPSCD23609', changeTypeId);
        }
    }
}
