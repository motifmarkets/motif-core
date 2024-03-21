/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { AssertInternalError, Integer, UsableListChangeTypeId } from '../../sys/internal-api';
import { DataMessage, DataMessageTypeId, FeedClassId, FeedId, FeedInfo, FeedsDataMessage, OrderStatusesDataDefinition } from '../common/internal-api';
import { RecordsPublisherSubscriptionDataItem } from '../publish-subscribe/internal-api';
import { DataFeed } from './data-feed';
import { Feed } from './feed';
import { OrderStatusesDataItem } from './order-statuses-data-item';
import { TradingFeed } from './trading-feed';

export class FeedsDataItem extends RecordsPublisherSubscriptionDataItem<Feed> {
    getFeed(feedId: FeedId) {
        for (const feed of this.records) {
            if (feed.id === feedId) {
                return feed;
            }
        }
        return undefined;
    }

    override processMessage(msg: DataMessage) {
        if (msg.typeId !== DataMessageTypeId.Feeds) {
            super.processMessage(msg);
        } else {
            if (!(msg instanceof FeedsDataMessage)) {
                throw new AssertInternalError('FDIPM1004888847', JSON.stringify(msg));
            } else {
                this.beginUpdate();
                try {
                    this.advisePublisherResponseUpdateReceived();
                    this.processMessage_Feeds(msg);
                    this.notifyUpdateChange();
                } finally {
                    this.endUpdate();
                }
            }
        }
    }

    private createFeed(msgFeed: FeedsDataMessage.Feed) {
        const id = msgFeed.id;
        const classId = FeedInfo.idToClassId(id);
        let result: Feed;
        switch (classId) {
            case FeedClassId.Trading: {
                const orderStatusesDefinition = new OrderStatusesDataDefinition();
                orderStatusesDefinition.tradingFeedId = id;
                const orderStatusesDataItem = this.subscribeDataItem(orderStatusesDefinition) as OrderStatusesDataItem;

                const msgTradingFeed = msgFeed as FeedsDataMessage.TradingFeed;
                const tradingFeed = new TradingFeed(id,
                    msgTradingFeed.environmentId,
                    msgTradingFeed.statusId,
                    this.correctnessId,
                    orderStatusesDataItem,
                    () => { this.unsubscribeDataItem(orderStatusesDataItem); }
                );
                result = tradingFeed;
                break;
            }
            case FeedClassId.News: {
                const msgDataFeed = msgFeed as FeedsDataMessage.DataFeed;
                result = new DataFeed(id, msgDataFeed.environmentId, msgDataFeed.statusId, this.correctnessId);
                break;
            }
            default:
                result = new Feed(id, msgFeed.statusId, this.correctnessId);
        }
        return result;
    }

    private indexOfFeed(feedId: FeedId) {
        const count = this.count;
        for (let i = 0; i < count; i++) {
            const feed = this.records[i];
            if (feed.id === feedId) {
                return i;
            }
        }
        return -1;
    }

    private checkApplyAddRange(msgFeeds: FeedsDataMessage.Feeds, addStartMsgIdx: Integer, endPlus1MsgIdx: Integer) {
        if (addStartMsgIdx >= 0) {
            const addCount = endPlus1MsgIdx - addStartMsgIdx;
            const addStartIdx = this.extendRecordCount(addCount);
            let addIdx = addStartIdx;
            for (let i = addStartMsgIdx; i < endPlus1MsgIdx; i++) {
                const msgFeed = msgFeeds[i];
                const feed = this.createFeed(msgFeed);
                this.setRecord(addIdx++, feed);
            }
            this.checkUsableNotifyListChange(UsableListChangeTypeId.Insert, addStartIdx, addCount);
        }
    }

    private processMessage_Feeds(msg: FeedsDataMessage) {
        let addStartMsgIdx = -1;

        for (let i = 0; i < msg.feeds.length; i++) {
            const msgFeed = msg.feeds[i];
            const idx = this.indexOfFeed(msgFeed.id);
            if (idx >= 0) {
                this.checkApplyAddRange(msg.feeds, addStartMsgIdx, i);
                const feed = this.records[idx];
                feed.change(msgFeed.statusId);
            } else {
                if (addStartMsgIdx < 0) {
                    addStartMsgIdx = i;
                }
            }
        }

        this.checkApplyAddRange(msg.feeds, addStartMsgIdx, msg.feeds.length);
    }
}
