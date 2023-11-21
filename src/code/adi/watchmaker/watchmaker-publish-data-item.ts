/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { DataDefinition, FeedId } from '../common/adi-common-internal-api';
import { FeedSubscriptionDataItem } from '../feed/internal-api';

export abstract class WatchmakerPublishDataItem extends FeedSubscriptionDataItem {
    constructor(definition: DataDefinition) {
        super(definition)
        this.setFeedId(FeedId.Watchlist);
    }
}
