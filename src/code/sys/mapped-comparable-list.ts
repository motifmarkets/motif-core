/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { ChangeSubscribableComparableList } from './change-subscribable-comparable-list';
import { ErrorCode } from './error-code';
import { DuplicateError } from './external-error';
import { UnreachableCaseError } from './internal-error';
import { Integer, MapKey, Mappable } from './types';

/** @public */
export class MappedComparableList<out T extends (Mappable & U), in U = T> extends ChangeSubscribableComparableList<T, U> {
    onDuplicate = MappedComparableList.OnDuplicate.Error;
    duplicateErrorText = '';

    private _map = new Map<MapKey, T>();

    override clone(): MappedComparableList<T, U> {
        const result = new MappedComparableList<T, U>(this._compareItemsFtn);
        result.assign(this);
        return result;
    }

    getItemByKey(key: MapKey) {
        return this._map.get(key);
    }

    override setAt(index: Integer, value: T) {
        const existingValue = this.items[index];
        this._map.delete(existingValue.mapKey);
        if (this.checkIfDuplicateCanAdd(value)) {
            super.setAt(index, value);
            this._map.set(value.mapKey, value);
        }
    }

    override add(value: T) {
        if (this.checkIfDuplicateCanAdd(value)) {
            this._map.set(value.mapKey, value);
            return super.add(value);
        } else {
            return -1;
        }
    }

    override addRange(values: readonly T[]) {
        const onDuplicate = this.onDuplicate;
        if (onDuplicate === MappedComparableList.OnDuplicate.Never) {
            for (const value of values) {
                this._map.set(value.mapKey, value);
            }
            super.addRange(values);
        } else {
            const uncontainedValues = this.createArrayOfUncontainedValues(values, onDuplicate);
            super.addRange(uncontainedValues);
        }
    }

    override addSubRange(values: readonly T[], rangeStartIndex: Integer, rangeCount: Integer) {
        const onDuplicate = this.onDuplicate;
        if (onDuplicate === MappedComparableList.OnDuplicate.Never) {
            const nextSubRangeIdx = rangeStartIndex + rangeCount;
            for (let i = rangeStartIndex; i < nextSubRangeIdx; i++) {
                const value = values[i];
                this._map.set(value.mapKey, value);
            }
            super.addSubRange(values, rangeStartIndex, rangeCount);
        } else {
            const uncontainedValues = this.createArrayOfUncontainedValues(values, onDuplicate);
            super.addSubRange(uncontainedValues, rangeStartIndex, rangeCount);
        }
    }

    override insert(index: Integer, value: T) {
        if (this.checkIfDuplicateCanAdd(value)) {
            this._map.set(value.mapKey, value);
            super.insert(index, value);
        }
    }

    override insertRange(index: Integer, values: readonly T[]) {
        const onDuplicate = this.onDuplicate;
        if (onDuplicate === MappedComparableList.OnDuplicate.Never) {
            for (const value of values) {
                this._map.set(value.mapKey, value);
            }
            super.insertRange(index, values);
        } else {
            const uncontainedValues = this.createArrayOfUncontainedValues(values, onDuplicate);
            super.insertRange(index, uncontainedValues);
        }
    }

    override insertSubRange(index: Integer, values: readonly T[], subRangeStartIndex: Integer, subRangeCount: Integer) {
        const onDuplicate = this.onDuplicate;
        if (onDuplicate === MappedComparableList.OnDuplicate.Never) {
            const nextSubRangeIdx = subRangeStartIndex + subRangeCount;
            for (let i = subRangeStartIndex; i < nextSubRangeIdx; i++) {
                const value = values[i];
                this._map.set(value.mapKey, value);
            }
            super.insertSubRange(index, values, subRangeStartIndex, subRangeCount);
        } else {
            const uncontainedValues = this.createArrayOfUncontainedValues(values, onDuplicate);
            super.insertSubRange(index, uncontainedValues, subRangeStartIndex, subRangeCount);
        }
    }

    override remove(value: T) {
        super.remove(value);
        this._map.delete(value.mapKey);
    }

    override removeAtIndex(index: Integer) {
        const existingValue = this.items[index];
        this._map.delete(existingValue.mapKey);
        super.removeAtIndex(index);
    }

    override removeAtIndices(removeIndices: Integer[]) {
        for (const removeIndex of removeIndices) {
            const item = this.items[removeIndex];
            this._map.delete(item.mapKey);
        }
        super.removeAtIndices(removeIndices);
    }

    override removeRange(index: Integer, deleteCount: Integer) {
        const nextRangeIdx = index + deleteCount;
        for (let i = index; i < nextRangeIdx; i++) {
            const existingValue = this.items[i];
            this._map.delete(existingValue.mapKey);
        }
        super.removeRange(index, deleteCount);
    }

    override removeItems(removeItems: readonly T[]) {
        for (const item of removeItems) {
            this._map.delete(item.mapKey);
        }
        super.removeItems(removeItems);
    }

    override extract(value: T): T {
        this._map.delete(value.mapKey);
        return super.extract(value);
    }

    override clear() {
        this._map.clear();
        super.clear();
    }

    override contains(value: T) {
        return this._map.has(value.mapKey);
    }

    private checkIfDuplicateCanAdd(value: T): boolean {
        switch (this.onDuplicate) {
            case MappedComparableList.OnDuplicate.Never:
                return true;
            case MappedComparableList.OnDuplicate.Ignore:
                return !this.contains(value);
            case MappedComparableList.OnDuplicate.Error:
                if (this.contains(value)) {
                    throw this.createDuplicateError(value);
                } else {
                    return true;
                }
            default:
                throw new UnreachableCaseError('MCLCIFCA44412', this.onDuplicate);
        }
    }

    private createArrayOfUncontainedValues(values: readonly T[], onDuplicate: MappedComparableList.OnDuplicate) {
        const maxCount = values.length;
        const uncontainedValues = new Array<T>(maxCount);
        let uncontainedCount = 0;
        for (let i = 0; i < maxCount; i++) {
            const value = values[i];
            if (this.contains(value)) {
                if (onDuplicate === MappedComparableList.OnDuplicate.Error) {
                    throw this.createDuplicateError(value);
                } else {
                    uncontainedValues[uncontainedCount++] = value;
                    this._map.set(value.mapKey, value);
                }
            } else {
                uncontainedValues[uncontainedCount++] = value;
                this._map.set(value.mapKey, value);
            }
        }
        uncontainedValues.length = uncontainedCount;
        return uncontainedValues;
    }

    private createDuplicateError(value: T) {
        return new DuplicateError(ErrorCode.MappedComparableList_Duplicate, `${this.duplicateErrorText}: ${value.mapKey}`);
    }
}

export namespace MappedComparableList {
    export const enum OnDuplicate {
        Never,
        Ignore,
        Error,
    }
}
