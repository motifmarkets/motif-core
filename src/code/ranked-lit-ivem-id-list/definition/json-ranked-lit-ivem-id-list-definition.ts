/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { LitIvemId } from '../../adi/adi-internal-api';
import { Err, ErrorCode, Guid, JsonElement, Ok, Result } from "../../sys/sys-internal-api";
import { RankedLitIvemIdListDefinition } from './ranked-lit-ivem-id-list-definition';

export class JsonRankedLitIvemIdListDefinition extends RankedLitIvemIdListDefinition {
    constructor(
        id: Guid,
        readonly name: string,
        readonly description: string,
        readonly category: string,
        readonly litIvemIds: readonly LitIvemId[]
    ) {
        super(id, RankedLitIvemIdListDefinition.TypeId.Json);
    }

    override saveToJson(element: JsonElement) {
        super.saveToJson(element);
        const elementArray = LitIvemId.createJsonElementArray(this.litIvemIds);
        element.setElementArray(JsonRankedLitIvemIdListDefinition.litIvemIdsJsonName, elementArray);
    }
}

export namespace JsonRankedLitIvemIdListDefinition {
    export const nameJsonName = 'name';
    export const descriptionJsonName = 'description';
    export const categoryJsonName = 'category';
    export const litIvemIdsJsonName = 'litIvemIds';

    export function tryCreateFromJson(element: JsonElement): Result<JsonRankedLitIvemIdListDefinition> {
        const idResult = RankedLitIvemIdListDefinition.tryGetIdFromJson(element);
        if (idResult.isErr()) {
            return idResult.createOuter(ErrorCode.JsonRankedLitIvemIdListDefinition_IdIsInvalid);
        } else {
            const litIvemIdsResult = tryCreateLitIvemIdsFromJson(element);
            if (litIvemIdsResult.isErr()) {
                return litIvemIdsResult.createOuter(ErrorCode.JsonRankedLitIvemIdListDefinition_JsonLitIvemIdIsInvalid);
            } else {
                const name = element.getString(nameJsonName, '');
                const description = element.getString(descriptionJsonName, '');
                const category = element.getString(categoryJsonName, '');
                const definition = new JsonRankedLitIvemIdListDefinition(idResult.value, name, description, category, litIvemIdsResult.value);
                return new Ok(definition);
            }
        }
    }

    export function tryCreateLitIvemIdsFromJson(element: JsonElement): Result<LitIvemId[]> {
        const elementArrayResult = element.tryGetElementArray(litIvemIdsJsonName);
        if (elementArrayResult.isErr()) {
            const error = elementArrayResult.error;
            if (error === JsonElement.arrayErrorCode_NotSpecified) {
                return new Err(ErrorCode.JsonRankedLitIvemIdListDefinition_JsonLitIvemIdsNotSpecified);
            } else {
                return new Err(ErrorCode.JsonRankedLitIvemIdListDefinition_JsonLitIvemIdsIsInvalid);
            }
        } else {
            const litIvemIdsResult = LitIvemId.tryCreateArrayFromJsonElementArray(elementArrayResult.value);
            if (litIvemIdsResult.isErr()) {
                return litIvemIdsResult.createOuter(ErrorCode.JsonRankedLitIvemIdListDefinition_JsonLitIvemIdArrayIsInvalid);
            } else {
                return new Ok(litIvemIdsResult.value);
            }
        }
    }
}
