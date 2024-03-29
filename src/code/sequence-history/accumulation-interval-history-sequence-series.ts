/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { ComparableList, Integer, MultiEvent } from '../sys/internal-api';
import { IntervalHistorySequenceSeries } from './interval-history-sequence-series';
import { IntervalHistorySequencer } from './interval-history-sequencer';
import { NumberHistorySequenceSeriesInterface } from './number-history-sequence-series-interface';

export class AccumulationIntervalHistorySequenceSeries extends IntervalHistorySequenceSeries
    implements NumberHistorySequenceSeriesInterface {

    private _points = new ComparableList<AccumulationIntervalHistorySequenceSeries.Point>();

    private _stagedTick: AccumulationIntervalHistorySequenceSeries.StagedTick | undefined;

    private _pointInsertedEventSubscriptionId: MultiEvent.SubscriptionId;
    private _pointUpdatedEventSubscriptionId: MultiEvent.SubscriptionId;
    private _emptyIntervalsInsertedEventSubscriptionId: MultiEvent.SubscriptionId;

    constructor(sequencer: IntervalHistorySequencer) {
        super(sequencer);
        this._pointInsertedEventSubscriptionId = this.intervalSequencer.subscribePointInsertedEvent(
            (index) => this.handlePointInsertedEvent(index)
        );
        this._pointUpdatedEventSubscriptionId = this.intervalSequencer.subscribePointUpdatedEvent(
            (index) => this.handlePointUpdatedEvent(index)
        );
        this._emptyIntervalsInsertedEventSubscriptionId = this.intervalSequencer.subscribeEmptyIntervalsInsertedEvent(
            (index, count) => { this.handleEmptyIntervalsInsertedEvent(index, count); }
        );
    }

    protected get points() { return this._points; }

    override finalise() {
        this.intervalSequencer.unsubscribePointInsertedEvent(this._pointInsertedEventSubscriptionId);
        this._pointInsertedEventSubscriptionId = undefined;
        this.intervalSequencer.unsubscribePointUpdatedEvent(this._pointUpdatedEventSubscriptionId);
        this._pointUpdatedEventSubscriptionId = undefined;
        this.intervalSequencer.unsubscribeEmptyIntervalsInsertedEvent(this._emptyIntervalsInsertedEventSubscriptionId);
        this._emptyIntervalsInsertedEventSubscriptionId = undefined;
    }

    getNumberPoint(idx: Integer) {
        return this.points.getAt(idx);
    }

    stageOhlcTick(tickDateTime: Date, tickDateTimeRepeatCount: Integer,
        open: number, high: number, low: number, close: number | undefined
    ) {
        // should not be called if used for Volume
        this._stagedTick = {
            value: close,
        };
    }

    stageValueTick(tickDateTime: Date, tickDateTimeRepeatCount: Integer, value: number | undefined) {
        this._stagedTick = {
            value,
        };
    }

    clear() {
        this._points.clear();
    }

    initialiseWithNullPoints() {
        this._points.clear();
        const count = this.sequencerPoints.count;
        const nullPoints = new Array<AccumulationIntervalHistorySequenceSeries.Point>(count);
        for (let i = 0; i < count; i++) {
            nullPoints[i] = this.createNullPoint(i);
        }
        this._points.addRange(nullPoints);
    }

    private handlePointInsertedEvent(index: Integer) {
        if (this._stagedTick === undefined) {
            this.insertNullPoint(index);
        } else {
            this.insertPointFromStagedTick(index, this._stagedTick);
            this._stagedTick = undefined;
        }
        return false;
    }

    private handlePointUpdatedEvent(index: Integer) {
        if (this._stagedTick !== undefined) {
            this.updatePointFromStagedTick(index, this._stagedTick);
            this._stagedTick = undefined;
        }
        return false;
    }

    private handleEmptyIntervalsInsertedEvent(index: Integer, count: Integer) {
        this.insertNullPoints(index, count);
    }

    private insertNullPoint(index: Integer) {
        const point = this.createNullPoint(index);
        this._points.insert(index, point);
        this.notifyPointInserted(index);
    }

    private insertNullPoints(index: Integer, count: Integer) {
        const insertPoints = new Array<AccumulationIntervalHistorySequenceSeries.Point>(count);
        let pointIdx = index;
        for (let i = 0; i < count; i++) {
            insertPoints[i] = this.createNullPoint(pointIdx++);
        }
        this._points.insertRange(index, insertPoints);
        this.notifyPointsInserted(index, count);
    }

    private insertPointFromStagedTick(index: Integer, tick: AccumulationIntervalHistorySequenceSeries.StagedTick) {
        const point = this.createPointFromTick(index, tick);
        this._stagedTick = undefined;
        this._points.insert(index, point);
        this.notifyPointInserted(index);
    }

    private createNullPoint(index: Integer) {
        const result: AccumulationIntervalHistorySequenceSeries.Point = {
            null: true,
            value: 0,
        };
        return result;
    }

    private createPointFromTick(index: Integer, tick: AccumulationIntervalHistorySequenceSeries.StagedTick) {
        if (tick.value === undefined) {
            return this.createNullPoint(index);
        } else {
            const result: AccumulationIntervalHistorySequenceSeries.Point = {
                null: false,
                value: tick.value,
            };
            return result;
        }
    }

    private updatePointFromStagedTick(index: Integer, tick: AccumulationIntervalHistorySequenceSeries.StagedTick) {
        const point = this.points.getAt(index);
        const tickValue = tick.value;
        let updated: boolean;
        if (tickValue === undefined) {
            if (point.null) {
                updated = false;
            } else {
                point.null = true;
                point.value = 0;
                updated = true;
            }
        } else {
            if (point.null) {
                point.null = false;
                point.value = tickValue;
                updated = true;
            } else {
                if (tickValue !== 0) {
                    point.value += tickValue;
                    updated = true;
                } else {
                    updated = false;
                }
            }
        }

        if (updated) {
            this.notifyPointUpdated(index);
        }
    }
}


export namespace AccumulationIntervalHistorySequenceSeries {
    export interface Point extends IntervalHistorySequenceSeries.Point {
        value: number;
    }

    export interface StagedTick {
        value: number | undefined;
    }
}
