/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { CommaText, EnumInfoOutOfOrderError, Err, ErrorCode, Integer, Ok, Result } from '../../../../sys/sys-internal-api';
// import { GridRecordFieldState } from '../../../record/grid-record-internal-api';
import { GridFieldSourceDefinition } from '../../../field/grid-field-internal-api';
import { CorrectnessTableField, TableField } from '../../field/grid-table-field-internal-api';
import { CorrectnessTableValue, TableValue } from '../../value/grid-table-value-internal-api';

export abstract class TableFieldSourceDefinition extends GridFieldSourceDefinition {
    readonly fieldDefinitions: TableField.Definition[];

    constructor(
        // private readonly _customHeadingsService: TableFieldCustomHeadingsService,
        readonly typeId: TableFieldSourceDefinition.TypeId,
        name: string,
    ) {
        super(name);
        // this.sourceName = TableFieldSourceDefinition.Source.idToName(typeId);
    }

    get fieldCount(): Integer { return this.fieldDefinitions.length; }

    getFieldName(idx: Integer): string {
        return this.fieldDefinitions[idx].name;
    }

    // getFieldHeading(idx: Integer): string {
    //     return this.fieldDefinitions[idx].heading;
    // }

    findFieldByName(name: string): Integer | undefined {
        const upperName = name.toUpperCase();
        const idx = this.fieldDefinitions.findIndex((definition) => definition.name.toUpperCase() === upperName);
        return idx >= 0 ? idx : undefined;
    }

    // setFieldHeading(idx: Integer, text: string) {
    //     this.fieldDefinitions[idx].heading = text;
    //     this._customHeadingsService.setFieldHeading(this.name, this.getFieldName(idx), text);
    // }

    // protected tryGetCustomFieldHeading(fieldName: string): string | undefined {
    //     return this._customHeadingsService.tryGetFieldHeading(this.name, fieldName);
    // }
}

export namespace TableFieldSourceDefinition {
    export const enum TypeId {
        Feed,
        RankedLitIvemId,
        LitIvemBaseDetail,
        LitIvemExtendedDetail,
        LitIvemAlternateCodes,
        MyxLitIvemAttributes,
        GridLayoutDefinitionColumnEditRecord,
        SecurityDataItem,
        BrokerageAccounts,
        OrdersDataItem,
        HoldingsDataItem,
        BalancesDataItem,
        CallPut,
        CallSecurityDataItem,
        PutSecurityDataItem,
        TopShareholdersDataItem,
        Scan,
        /*LitIvemId_News,
        IvemId_Holding,
        CashItem_Holding,
        LitIvemId_IntradayProfitLossSymbolRec,
        LitIvemId_Alerts,
        LitIvemId_TmcDefinitionLegs,
        CallPut_SecurityDataItem,
        IvemId_CustomHolding,*/
    }

    export namespace Type {
        export type Id = TypeId;

        export const feedName = 'Feed';
        export const rankedLitIvemIdName = 'Rli';
        export const litIvemBaseDetailName = 'Lib';
        export const litIvemExtendedDetailName = 'Lie';
        export const litIvemAlternateCodesName = 'Liac';
        export const myxLitIvemAttributesName = 'MyxSA';
        export const gridLayoutDefinitionColumnEditRecordName = 'Gldcer';
        export const securityDataItemName = 'SecDI';
        export const brokerageAccountsName = 'Ba';
        export const ordersDataItemName = 'Odi';
        export const holdingsDataItemName = 'Hdi';
        export const balancesDataItemName = 'Bdi';
        export const callPutName = 'Cp';
        export const callPutSecurityDataItemName = 'CSecDI';
        export const putSecurityDataItemName = 'PSecDI';
        export const topShareholdersDataItemName = 'Tsh';
        export const scanName = 'Scn';

        interface Info {
            readonly id: Id;
            readonly name: string;
        }

        type InfoObjects = { [id in keyof typeof TypeId]: Info };
        const infoObject: InfoObjects = {
            Feed: { id: TypeId.Feed, name: feedName },
            RankedLitIvemId: { id: TypeId.RankedLitIvemId, name: rankedLitIvemIdName },
            LitIvemBaseDetail: { id: TypeId.LitIvemBaseDetail, name: litIvemBaseDetailName },
            LitIvemExtendedDetail: { id: TypeId.LitIvemExtendedDetail, name: litIvemExtendedDetailName },
            LitIvemAlternateCodes: { id: TypeId.LitIvemAlternateCodes, name: litIvemAlternateCodesName },
            MyxLitIvemAttributes: { id: TypeId.MyxLitIvemAttributes, name: myxLitIvemAttributesName },
            GridLayoutDefinitionColumnEditRecord: { id: TypeId.GridLayoutDefinitionColumnEditRecord, name: gridLayoutDefinitionColumnEditRecordName },
            SecurityDataItem: { id: TypeId.SecurityDataItem, name: securityDataItemName },
            BrokerageAccounts: { id: TypeId.BrokerageAccounts, name: brokerageAccountsName },
            OrdersDataItem: { id: TypeId.OrdersDataItem, name: ordersDataItemName },
            HoldingsDataItem: { id: TypeId.HoldingsDataItem, name: holdingsDataItemName },
            BalancesDataItem: { id: TypeId.BalancesDataItem, name: balancesDataItemName },
            CallPut: { id: TypeId.CallPut, name: callPutName },
            CallSecurityDataItem: { id: TypeId.CallSecurityDataItem, name: callPutSecurityDataItemName },
            PutSecurityDataItem: { id: TypeId.PutSecurityDataItem, name: putSecurityDataItemName },
            TopShareholdersDataItem: { id: TypeId.TopShareholdersDataItem, name: topShareholdersDataItemName },
            Scan: { id: TypeId.Scan, name: scanName },
        };

        export const idCount = Object.keys(infoObject).length;

        const infos: Info[] = Object.values(infoObject);

        export function idToName(id: TypeId): string {
            return infos[id].name;
        }

        export function tryNameToId(name: string) {
            for (const info of infos) {
                if (info.name === name) {
                    return info.id;
                }
            }
            return undefined;
        }

        export function initialiseSource() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('TableField.DefinitionSource.SourceId', outOfOrderIdx, infos[outOfOrderIdx].toString());
            }
        }
    }

    // used by descendants
    export type TableGridConstructors = [
        TableField.Constructor,
        TableValue.Constructor
    ];

    // used by descendants
    export type CorrectnessTableGridConstructors = [
        CorrectnessTableField.Constructor,
        CorrectnessTableValue.Constructor
    ];

    export function initialise() {
        Type.initialiseSource();
    }

    export interface DecodedFieldName {
        readonly sourceTypeId: Type.Id;
        readonly sourcelessName: string;
    }

    export function decodeCommaTextFieldName(value: string): Result<DecodedFieldName> {
        const commaTextResult = CommaText.tryToStringArray(value, true);
        if (commaTextResult.isErr()) {
            return commaTextResult.createOuter(commaTextResult.error);
        } else {
            const strArray = commaTextResult.value;
            if (strArray.length !== 2) {
                return new Err(ErrorCode.TableFieldSourceDefinition_DecodeCommaTextFieldNameNot2Elements);
            } else {
                const sourceName = strArray[0];
                const sourceId = Type.tryNameToId(sourceName);
                if (sourceId === undefined) {
                    return new Err(ErrorCode.TableFieldSourceDefinition_DecodeCommaTextFieldNameUnknownSourceId);
                } else {
                    const decodedFieldName: DecodedFieldName = {
                        sourceTypeId: sourceId,
                        sourcelessName: strArray[1],
                    }

                    return new Ok(decodedFieldName);
                }
            }
        }
    }
}
