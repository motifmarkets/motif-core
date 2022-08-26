/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { LitIvemId, MarketId } from '../adi/adi-internal-api';
import { StringId, Strings } from '../res/res-internal-api';
import { EnumRenderValue, RenderValue } from '../services/services-internal-api';
import { EnumInfoOutOfOrderError } from '../sys/sys-internal-api';
import { Integer } from '../sys/types';
import { BooleanScanCriteriaNode } from './scan-criteria-node';


export class Scan {
    id: string;
    index: Integer; // within list of scans - used by Grid
    name: string;
    description: string;
    category: string;
    isWritable: string;
    targetTypeId: Scan.TargetTypeId;
    targetMarkets: MarketId[];
    targetLitIvemIds: LitIvemId[];
    matched: boolean;
    unmodifiedVersion: number;
    criteria: BooleanScanCriteriaNode;
    history: BooleanScanCriteriaNode[];
    modifiedStatusId: Scan.ModifiedStatusId;
}

export namespace Scan {
    export const enum ModifiedStatusId {
        Unmodified,
        Modified,
        Conflict,
    }

    export namespace ModifiedStatus {
        export type Id = ModifiedStatusId;

        interface Info {
            readonly id: Id;
            readonly name: string;
            readonly displayId: StringId;
        }

        type InfosObject = { [id in keyof typeof ModifiedStatusId]: Info };

        const infosObject: InfosObject = {
            Unmodified: {
                id: ModifiedStatusId.Unmodified,
                name: 'Unmodified',
                displayId: StringId.ScanModifiedStatusDisplay_Unmodified,
            },
            Modified: {
                id: ModifiedStatusId.Modified,
                name: 'Modified',
                displayId: StringId.ScanModifiedStatusDisplay_Modified,
            },
            Conflict: {
                id: ModifiedStatusId.Conflict,
                name: 'Conflict',
                displayId: StringId.ScanModifiedStatusDisplay_Conflict,
            },
        } as const;

        export const idCount = Object.keys(infosObject).length;

        const infos = Object.values(infosObject);

        export function initialise() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('Scan.TargetTypeId', outOfOrderIdx, infos[outOfOrderIdx].name);
            }
        }

        export function idToDisplayId(id: Id): StringId {
            return infos[id].displayId;
        }

        export function idToDisplay(id: Id): string {
            return Strings[idToDisplayId(id)];
        }
    }

    export const enum TargetTypeId {
        Markets,
        Symbols,
    }

    export namespace TargetType {
        export type Id = TargetTypeId;

        interface Info {
            readonly id: Id;
            readonly name: string;
            readonly displayId: StringId;
        }

        type InfosObject = { [id in keyof typeof TargetTypeId]: Info };

        const infosObject: InfosObject = {
            Markets: {
                id: TargetTypeId.Markets,
                name: 'Markets',
                displayId: StringId.ScanTargetTypeDisplay_Markets,
            },
            Symbols: {
                id: TargetTypeId.Symbols,
                name: 'Symbols',
                displayId: StringId.ScanTargetTypeDisplay_Symbols,
            },
        } as const;

        export const idCount = Object.keys(infosObject).length;

        const infos = Object.values(infosObject);

        export function initialise() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('Scan.TargetTypeId', outOfOrderIdx, infos[outOfOrderIdx].name);
            }
        }

        export function idToDisplayId(id: Id): StringId {
            return infos[id].displayId;
        }

        export function idToDisplay(id: Id): string {
            return Strings[idToDisplayId(id)];
        }
    }

    export namespace Field {
        export const enum Id {
            Id,
            Index,
            Name,
            Description,
            // eslint-disable-next-line @typescript-eslint/no-shadow
            TargetTypeId,
            TargetMarkets,
            TargetLitIvemIds,
            Matched,
            // eslint-disable-next-line @typescript-eslint/no-shadow
            ModifiedStatusId,
        }

        interface Info {
            readonly id: Id;
            readonly name: string;
        }

        type InfosObject = { [id in keyof typeof Id]: Info };

        const infosObject: InfosObject = {
            Id: {
                id: Id.Id,
                name: 'Id',
            },
            Index: {
                id: Id.Index,
                name: 'Index',
            },
            Name: {
                id: Id.Name,
                name: 'Name',
            },
            Description: {
                id: Id.Description,
                name: 'Description',
            },
            TargetTypeId: {
                id: Id.TargetTypeId,
                name: 'TargetTypeId',
            },
            TargetMarkets: {
                id: Id.TargetMarkets,
                name: 'TargetMarkets',
            },
            TargetLitIvemIds: {
                id: Id.TargetLitIvemIds,
                name: 'TargetLitIvemIds',
            },
            Matched: {
                id: Id.Matched,
                name: 'Matched',
            },
            ModifiedStatusId: {
                id: Id.ModifiedStatusId,
                name: 'ModifiedStatusId',
            },
        } as const;

        export const idCount = Object.keys(infosObject).length;
        const infos = Object.values(infosObject);

        export function initialise() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: number) => info.id !== index);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('DayTradeDataItem.Field.Id', outOfOrderIdx, `${idToName(outOfOrderIdx)}`);
            }
        }

        export function idToName(id: Id) {
            return infos[id].name;
        }
    }

    export class TargetTypeIdRenderValue extends EnumRenderValue {
        constructor(data: TargetTypeId | undefined) {
            super(data, RenderValue.TypeId.ScanTargetTypeId);
        }
    }
    export class ModifiedStatusIdRenderValue extends EnumRenderValue {
        constructor(data: ModifiedStatusId | undefined) {
            super(data, RenderValue.TypeId.ScanModifiedStatusId);
        }
    }
}

export namespace ScanModule {
    export function initialiseStatic() {
        Scan.Field.initialise();
        Scan.ModifiedStatus.initialise();
        Scan.TargetType.initialise();
    }
}
