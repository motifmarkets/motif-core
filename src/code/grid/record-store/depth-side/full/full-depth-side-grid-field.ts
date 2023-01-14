/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { OrderSideId } from '../../../../adi/adi-internal-api';
import { RenderValue } from '../../../../services/services-internal-api';
import { CorrectnessId, UnreachableCaseError } from '../../../../sys/sys-internal-api';
import { DepthSideGridField } from '../depth-side-grid-field';
import { FullDepthRecord } from './full-depth-record';
import { FullDepthSideField, FullDepthSideFieldId } from './full-depth-side-field';

export class FullDepthSideGridField extends DepthSideGridField {
    constructor(
        private _id: FullDepthSideFieldId,
        private _sideId: OrderSideId,
        private _getDataItemCorrectnessIdEvent: FullDepthSideGridField.GetDataItemCorrectnessIdEventHandler
    ) {
        super(
            FullDepthSideField.idToName(_id),
            FullDepthSideField.idToDefaultHeading(_id),
            FullDepthSideField.idToDefaultTextAlign(_id),
        );
    }

    override getValue(record: FullDepthRecord): RenderValue {
        let dataCorrectnessAttribute: RenderValue.Attribute | undefined;
        const correctnessId = this._getDataItemCorrectnessIdEvent();
        switch (correctnessId) {
            case CorrectnessId.Suspect:
                dataCorrectnessAttribute = RenderValue.DataCorrectnessAttribute.suspect;
                break;
            case CorrectnessId.Error:
                dataCorrectnessAttribute = RenderValue.DataCorrectnessAttribute.error;
                break;
            case CorrectnessId.Usable:
            case CorrectnessId.Good:
                dataCorrectnessAttribute = undefined;
                break;
            default:
                throw new UnreachableCaseError('DSGFGFV27759', correctnessId);
        }

        return record.getRenderValue(this._id, this._sideId, dataCorrectnessAttribute);
    }

    compare(left: FullDepthRecord, right: FullDepthRecord): number {
        return FullDepthRecord.compareField(this._id, left, right);
    }

    compareDesc(left: FullDepthRecord, right: FullDepthRecord): number {
        return FullDepthRecord.compareFieldDesc(this._id, left, right);
    }
}

export namespace FullDepthSideGridField {
    export type GetDataItemCorrectnessIdEventHandler = (this: void) => CorrectnessId;

    // export function createAllFields(
    //     sideId: OrderSideId,
    //     getDataItemCorrectnessIdEventHandler: DepthSideGridField.GetDataItemCorrectnessIdEventHandler,
    // ): DepthSideGridField[] {
    //     const idCount = FullDepthSideField.idCount;

    //     const fields = new Array<DepthSideGridField>(idCount);

    //     for (let id = 0; id < idCount; id++) {
    //         fields[id] = new FullDepthSideGridField(id, sideId, getDataItemCorrectnessIdEventHandler);
    //     }

    //     return fields;
    // }

    // export function createAllFieldsAndDefaults(
    //     sideId: OrderSideId,
    //     getDataItemCorrectnessIdEventHandler: DepthSideGridField.GetDataItemCorrectnessIdEventHandler,
    // ): DepthSideGridField.AllFieldsAndDefaults {
    //     const idCount = FullDepthSideField.idCount;

    //     const fields = new Array<DepthSideGridField>(idCount);
    //     const defaultStates = new Array<GridRecordFieldState>(idCount);
    //     const defaultVisibles = new Array<boolean>(idCount);

    //     for (let id = 0; id < idCount; id++) {
    //         fields[id] = new FullDepthSideGridField(id, sideId, getDataItemCorrectnessIdEventHandler);
    //         const defaultState: GridRecordFieldState = {
    //             header: FullDepthSideField.idToDefaultHeading(id),
    //             alignment: FullDepthSideField.idToDefaultTextAlign(id),
    //         };
    //         defaultStates[id] = defaultState;
    //         defaultVisibles[id] = FullDepthSideField.idToDefaultVisible(id);
    //     }

    //     return {
    //         fields,
    //         defaultStates,
    //         defaultVisibles,
    //     };
    // }
}
