/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { EnumInfoOutOfOrderError, PickEnum } from '../../sys/sys-internal-api';

export namespace ScanCriteria {
    export const enum NodeTypeId {
        // Boolean
        And,
        Or,
        Not,

        // Comparison
        NumericEquals,
        NumericGreaterThan,
        NumericGreaterThanOrEqual,
        NumericLessThan,
        NumericLessThanOrEqual,
        All,
        None,

        // Binary arithmetic operations
        NumericAdd,
        NumericDiv,
        NumericMod,
        NumericMul,
        NumericSub,

        // Unary arithmetic operations
        NumericNeg,
        NumericPos,
        NumericAbs,

        // Get Field Value
        NumericFieldValueGet,
        // DateFieldValueGet,

        // Field Comparison
        // BooleanFieldHasValue,
        BooleanFieldEquals,
        NumericFieldHasValue,
        NumericFieldEquals,
        NumericFieldInRange,
        DateFieldHasValue,
        DateFieldEquals,
        DateFieldInRange,
        TextFieldHasValue,
        TextFieldContains,
        PriceSubFieldHasValue,
        PriceSubFieldEquals,
        PriceSubFieldInRange,
        DateSubFieldHasValue,
        DateSubFieldEquals,
        DateSubFieldInRange,
        AltCodeSubFieldHasValue,
        AltCodeSubFieldContains,
        AttributeSubFieldHasValue,
        AttributeSubFieldContains,
    }

    export type BooleanNodeTypeId = PickEnum<NodeTypeId,
        NodeTypeId.And |
        NodeTypeId.Or |
        NodeTypeId.Not |
        NodeTypeId.NumericEquals |
        NodeTypeId.NumericGreaterThan |
        NodeTypeId.NumericGreaterThanOrEqual |
        NodeTypeId.NumericLessThan |
        NodeTypeId.NumericLessThanOrEqual |
        NodeTypeId.All |
        NodeTypeId.None |
        // NodeTypeId.BooleanFieldHasValue |
        NodeTypeId.BooleanFieldEquals |
        NodeTypeId.NumericFieldHasValue |
        NodeTypeId.NumericFieldEquals |
        NodeTypeId.NumericFieldInRange |
        NodeTypeId.DateFieldHasValue |
        NodeTypeId.DateFieldEquals |
        NodeTypeId.DateFieldInRange |
        NodeTypeId.TextFieldHasValue |
        NodeTypeId.TextFieldContains |
        NodeTypeId.PriceSubFieldHasValue |
        NodeTypeId.PriceSubFieldEquals |
        NodeTypeId.PriceSubFieldInRange |
        NodeTypeId.DateSubFieldHasValue |
        NodeTypeId.DateSubFieldEquals |
        NodeTypeId.DateSubFieldInRange |
        NodeTypeId.AltCodeSubFieldHasValue |
        NodeTypeId.AltCodeSubFieldContains |
        NodeTypeId.AttributeSubFieldHasValue |
        NodeTypeId.AttributeSubFieldContains
    >;

    export type NumericNodeTypeId = PickEnum<NodeTypeId,
        NodeTypeId.NumericAdd |
        NodeTypeId.NumericDiv |
        NodeTypeId.NumericMod |
        NodeTypeId.NumericMul |
        NodeTypeId.NumericSub |
        NodeTypeId.NumericNeg |
        NodeTypeId.NumericPos |
        NodeTypeId.NumericAbs |
        NodeTypeId.NumericFieldValueGet
    >;

    // export type DateNodeTypeId = PickEnum<NodeTypeId,
    //     NodeTypeId.DateFieldValueGet |
    //     NodeTypeId.DateSubFieldValueGet
    // >;

    export abstract class Node {
        typeId: NodeTypeId;
    }

    // All scan criteria which return a boolean descend from this
    export abstract class BooleanNode extends Node {
        override typeId: BooleanNodeTypeId;
    }

    export abstract class ZeroOperandBooleanNode extends BooleanNode {
    }

    export abstract class SingleOperandBooleanNode extends BooleanNode {
        operand: BooleanNode;
    }

    export abstract class NumericComparisonBooleanNode extends BooleanNode {
        leftOperand: NumericNode | number;
        rightOperand: NumericNode | number;
    }

    export abstract class MultiOperandBooleanNode extends BooleanNode {
        operands: BooleanNode[];
    }

    export class NoneNode extends ZeroOperandBooleanNode {
        override typeId: NodeTypeId.None;
    }

    export class AllNode extends ZeroOperandBooleanNode {
        override typeId: NodeTypeId.All;
    }

    export class NotNode extends SingleOperandBooleanNode {
        override typeId: NodeTypeId.Not;
    }

    export class AndNode extends MultiOperandBooleanNode {
        override typeId: NodeTypeId.And;
    }

    export class OrNode extends MultiOperandBooleanNode {
        override typeId: NodeTypeId.Or;
    }

    export abstract class FieldBooleanNode extends BooleanNode {
        fieldId: FieldId;
    }

    export class BooleanFieldNode extends FieldBooleanNode {
        override fieldId: BooleanFieldId;
    }

    export class BooleanFieldEqualsNode extends BooleanFieldNode {
        override typeId: NodeTypeId.BooleanFieldEquals;
        target: boolean; // | BooleanNode;
    }

    export abstract class NumericFieldNode extends FieldBooleanNode {
        override fieldId: NumericFieldId;
    }

    export class NumericFieldHasValueNode extends NumericFieldNode {
        override typeId: NodeTypeId.NumericFieldHasValue;
    }

    export class NumericFieldEqualsNode extends NumericFieldNode {
        override typeId: NodeTypeId.NumericFieldEquals;
        target: number; // | NumericNode;
    }

    export class NumericFieldInRangeNode extends NumericFieldNode {
        override typeId: NodeTypeId.NumericFieldInRange;
        min: number | undefined; // | NumericNode;
        max: number | undefined; // | NumericNode;
    }

    export class DateFieldNode extends FieldBooleanNode {
        override fieldId: DateFieldId;
    }

    export class DateFieldHasValueNode extends DateFieldNode {
        override typeId: NodeTypeId.DateFieldHasValue;
    }

    export class DateFieldEqualsNode extends DateFieldNode {
        override typeId: NodeTypeId.DateFieldEquals;
        target: Date;
    }

    export class DateFieldInRangeNode extends DateFieldNode {
        override typeId: NodeTypeId.DateFieldInRange;
        min: Date | undefined;
        max: Date | undefined;
    }

    export class TextFieldNode extends FieldBooleanNode {
        override fieldId: TextFieldId;
    }

    export class TextFieldHasValueNode extends TextFieldNode {
        override typeId: NodeTypeId.TextFieldHasValue;
    }

    export class TextFieldContainsNode extends TextFieldNode {
        override typeId: NodeTypeId.TextFieldContains;
        value: string;
        as: TextContainsAsId;
        ignoreCase: boolean;
    }

    export abstract class SubFieldNode<TypeId extends BooleanNodeTypeId, SubbedFieldId extends FieldId, SubFieldId> extends FieldBooleanNode {
        override typeId: TypeId;
        override fieldId: SubbedFieldId;
        subFieldId: SubFieldId;
    }

    export abstract class PriceSubFieldNode<TypeId extends BooleanNodeTypeId> extends SubFieldNode<TypeId, FieldId.Price, PriceSubFieldId> {
    }

    export class PriceSubFieldHasValueNode extends PriceSubFieldNode<NodeTypeId.PriceSubFieldHasValue> {
    }

    export class PriceSubFieldEqualsNode extends PriceSubFieldNode<NodeTypeId.PriceSubFieldEquals> {
        target: number; // | NumericNode;
    }

    export class PriceSubFieldInRangeNode extends PriceSubFieldNode<NodeTypeId.PriceSubFieldInRange> {
        min: number | undefined; // | NumericNode;
        max: number | undefined; // | NumericNode;
    }

    // There is only one Subbed field which works with date fields.
    export abstract class DateSubFieldNode<TypeId extends BooleanNodeTypeId> extends SubFieldNode<TypeId, FieldId.Date, DateSubFieldId> {
    }

    export class DateSubFieldHasValueNode extends DateSubFieldNode<NodeTypeId.DateSubFieldHasValue> {
    }

    export class DateSubFieldEqualsNode extends DateSubFieldNode<NodeTypeId.DateSubFieldEquals> {
        target: Date;
    }

    export class DateSubFieldInRangeNode extends DateSubFieldNode<NodeTypeId.DateSubFieldInRange> {
        min: Date | undefined; // | DateNode;
        max: Date | undefined; // | DateNode;
    }

    export abstract class AltCodeSubFieldNode<TypeId extends BooleanNodeTypeId> extends SubFieldNode<TypeId, FieldId.AltCode, AltCodeSubFieldId> {
    }

    export class AltCodeSubFieldHasValueNode extends AltCodeSubFieldNode<NodeTypeId.AltCodeSubFieldHasValue> {
    }

    export class AltCodeSubFieldContainsNode extends AltCodeSubFieldNode<NodeTypeId.AltCodeSubFieldContains> {
        value: string;
        as: TextContainsAsId;
        ignoreCase: boolean;
    }

    export abstract class AttributeSubFieldNode<TypeId extends BooleanNodeTypeId> extends SubFieldNode<TypeId, FieldId.Attribute, AttributeSubFieldId> {
    }

    export class AttributeSubFieldHasValueNode extends AttributeSubFieldNode<NodeTypeId.AttributeSubFieldHasValue> {
    }

    export class AttributeSubFieldContainsNode extends AttributeSubFieldNode<NodeTypeId.AttributeSubFieldContains> {
        value: string;
        as: TextContainsAsId;
        ignoreCase: boolean;
    }

    export class NumericEqualsNode extends NumericComparisonBooleanNode {
        override typeId: NodeTypeId.NumericEquals;
    }

    export class NumericGreaterThanNode extends NumericComparisonBooleanNode {
        override typeId: NodeTypeId.NumericGreaterThan;
    }

    export class NumericGreaterThanOrEqualNode extends NumericComparisonBooleanNode {
        override typeId: NodeTypeId.NumericGreaterThanOrEqual;
    }

    export class NumericLessThanNode extends NumericComparisonBooleanNode {
        override typeId: NodeTypeId.NumericLessThan;
    }

    export class NumericLessThanOrEqualNode extends NumericComparisonBooleanNode {
        override typeId: NodeTypeId.NumericLessThanOrEqual;
    }

    // All scan criteria which return a number descend from this
    export abstract class NumericNode extends Node {
        override typeId: NumericNodeTypeId;
    }

    export abstract class UnaryArithmeticNumericNode extends NumericNode {
        operand: number | NumericNode;
    }

    export class NumericNegNode extends UnaryArithmeticNumericNode {
        override typeId: NodeTypeId.NumericNeg;
    }

    export class NumericPosNode extends UnaryArithmeticNumericNode {
        override typeId: NodeTypeId.NumericPos;
    }

    export class NumericAbsNode extends UnaryArithmeticNumericNode {
        override typeId: NodeTypeId.NumericAbs;
    }

    export abstract class LeftRightArithmeticNumericNode extends NumericNode {
        leftOperand: number | NumericNode;
        rightOperand: number | NumericNode;
    }

    export class NumericAddNode extends LeftRightArithmeticNumericNode {
        override typeId: NodeTypeId.NumericAdd;
    }

    export class NumericDivNode extends LeftRightArithmeticNumericNode {
        override typeId: NodeTypeId.NumericDiv;
    }

    export class NumericModNode extends LeftRightArithmeticNumericNode {
        override typeId: NodeTypeId.NumericMod;
    }

    export class NumericMulNode extends LeftRightArithmeticNumericNode {
        override typeId: NodeTypeId.NumericMul;
    }

    export abstract class SubNode extends LeftRightArithmeticNumericNode {
        override typeId: NodeTypeId.NumericSub;
    }

    export class NumericFieldValueGetNode extends NumericNode {
        override typeId: NodeTypeId.NumericFieldValueGet;
        fieldId: NumericFieldId;
    }

    // export class NumericSubFieldValueGetNode extends NumericNode {
    //     override typeId: NodeTypeId.NumericSubFieldValueGet;
    //     fieldId: NumericFieldId;
    //     subFieldId: PriceSubFieldId;
    // }

    // All scan criteria which return a Date descend from this
    // export abstract class DateNode extends Node {
    //     override typeId: DateNodeTypeId;
    // }

    // export class DateFieldValueGetNode extends DateNode {
    //     override typeId: NodeTypeId.DateFieldValueGet;
    //     fieldId: DateFieldId;
    // }

    // export class DateSubFieldValueGetNode extends DateNode {
    //     override typeId: NodeTypeId.DateSubFieldValueGet;
    //     fieldId: DateFieldId;
    //     subFieldId: DateSubFieldId;
    // }

    export const enum TextContainsAsId {
        None,
        FromStart,
        FromEnd,
        Exact,
    }

    export const enum FieldId {
        AltCode, // Text, Subbed
        Attribute, // Text, Subbed
        Auction, // Numeric
        AuctionLast, // Numeric
        AuctionQuantity, // Numeric
        BestAskCount, // Numeric
        BestAskPrice, // Numeric
        BestAskQuantity, // Numeric
        BestBidCount, // Numeric
        BestBidPrice, // Numeric
        BestBidQuantity, // Numeric
        Board, // Text
        CallOrPut, // Text
        Category, // Text
        CFI, // Text
        Class, // Text
        ClosePrice, // Numeric
        Code, // Text
        ContractSize, // Numeric
        Currency, // Text
        Data, // Text
        Date, // Date, Subbed
        Exchange, // Text
        ExerciseType, // Text
        ExpiryDate, // Date
        HighPrice, // Numeric
        IsIndex, // Boolean
        LastPrice, // Numeric
        Leg, // Text
        LotSize, // Numeric
        LowPrice, // Numeric
        Market, // Text
        Name, // Text
        OpenInterest, // Numeric
        OpenPrice, // Numeric
        Price, // Numeric, Subbed
        PreviousClose, // Numeric
        QuotationBasis, // Text
        Remainder, // Numeric
        ShareIssue, // Numeric
        State, // Text
        StateAllows, // Text
        StatusNote, // Text
        StrikePrice, // Numeric
        Trades, // Numeric
        TradingMarket, // Text
        ValueTraded, // Numeric
        Volume, // Numeric
        VWAP, // Numeric
    }

    export namespace Field {
        export type Id = FieldId;

        interface Info {
            readonly id: Id;
            readonly dataTypeId: FieldDataTypeId;
            readonly subbed: boolean;
            readonly comparable: boolean;
        }

        type InfosObject = { [id in keyof typeof FieldId]: Info };

        const infosObject: InfosObject = {
            AltCode: {
                id: FieldId.AltCode,
                dataTypeId: FieldDataTypeId.Text,
                subbed: true,
                comparable: false,
            },
            Attribute: {
                id: FieldId.Attribute,
                dataTypeId: FieldDataTypeId.Text,
                subbed: true,
                comparable: false,
            },
            Auction: {
                id: FieldId.Auction,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            AuctionLast: {
                id: FieldId.AuctionLast,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            AuctionQuantity: {
                id: FieldId.AuctionQuantity,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            BestAskCount: {
                id: FieldId.BestAskCount,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            BestAskPrice: {
                id: FieldId.BestAskPrice,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            BestAskQuantity: {
                id: FieldId.BestAskQuantity,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            BestBidCount: {
                id: FieldId.BestBidCount,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            BestBidPrice: {
                id: FieldId.BestBidPrice,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            BestBidQuantity: {
                id: FieldId.BestBidQuantity,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            Board: {
                id: FieldId.Board,
                dataTypeId: FieldDataTypeId.Text,
                subbed: false,
                comparable: false,
            },
            CallOrPut: {
                id: FieldId.CallOrPut,
                dataTypeId: FieldDataTypeId.Text,
                subbed: false,
                comparable: false,
            },
            Category: {
                id: FieldId.Category,
                dataTypeId: FieldDataTypeId.Text,
                subbed: false,
                comparable: false,
            },
            CFI: {
                id: FieldId.CFI,
                dataTypeId: FieldDataTypeId.Text,
                subbed: false,
                comparable: false,
            },
            Class: {
                id: FieldId.Class,
                dataTypeId: FieldDataTypeId.Text,
                subbed: false,
                comparable: false,
            },
            ClosePrice: {
                id: FieldId.ClosePrice,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            Code: {
                id: FieldId.Code,
                dataTypeId: FieldDataTypeId.Text,
                subbed: false,
                comparable: false,
            },
            ContractSize: {
                id: FieldId.ContractSize,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            Currency: {
                id: FieldId.Currency,
                dataTypeId: FieldDataTypeId.Text,
                subbed: false,
                comparable: false,
            },
            Data: {
                id: FieldId.Data,
                dataTypeId: FieldDataTypeId.Text,
                subbed: false,
                comparable: false,
            },
            Date: {
                id: FieldId.Date,
                dataTypeId: FieldDataTypeId.Date,
                subbed: true,
                comparable: false,
            },
            Exchange: {
                id: FieldId.Exchange,
                dataTypeId: FieldDataTypeId.Text,
                subbed: false,
                comparable: false,
            },
            ExerciseType: {
                id: FieldId.ExerciseType,
                dataTypeId: FieldDataTypeId.Text,
                subbed: false,
                comparable: false,
            },
            ExpiryDate: {
                id: FieldId.ExpiryDate,
                dataTypeId: FieldDataTypeId.Date,
                subbed: false,
                comparable: false,
            },
            HighPrice: {
                id: FieldId.HighPrice,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            IsIndex: {
                id: FieldId.IsIndex,
                dataTypeId: FieldDataTypeId.Boolean,
                subbed: false,
                comparable: false,
            },
            LastPrice: {
                id: FieldId.LastPrice,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            Leg: {
                id: FieldId.Leg,
                dataTypeId: FieldDataTypeId.Text,
                subbed: false,
                comparable: false,
            },
            LotSize: {
                id: FieldId.LotSize,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            LowPrice: {
                id: FieldId.LowPrice,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            Market: {
                id: FieldId.Market,
                dataTypeId: FieldDataTypeId.Text,
                subbed: false,
                comparable: false,
            },
            Name: {
                id: FieldId.Name,
                dataTypeId: FieldDataTypeId.Text,
                subbed: false,
                comparable: false,
            },
            OpenInterest: {
                id: FieldId.OpenInterest,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            OpenPrice: {
                id: FieldId.OpenPrice,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            Price: {
                id: FieldId.Price,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            PreviousClose: {
                id: FieldId.PreviousClose,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            QuotationBasis: {
                id: FieldId.QuotationBasis,
                dataTypeId: FieldDataTypeId.Text,
                subbed: false,
                comparable: false,
            },
            Remainder: {
                id: FieldId.Remainder,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            ShareIssue: {
                id: FieldId.ShareIssue,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            State: {
                id: FieldId.State,
                dataTypeId: FieldDataTypeId.Text,
                subbed: false,
                comparable: false,
            },
            StateAllows: {
                id: FieldId.StateAllows,
                dataTypeId: FieldDataTypeId.Text,
                subbed: false,
                comparable: false,
            },
            StatusNote: {
                id: FieldId.StatusNote,
                dataTypeId: FieldDataTypeId.Text,
                subbed: false,
                comparable: false,
            },
            StrikePrice: {
                id: FieldId.StrikePrice,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            Trades: {
                id: FieldId.Trades,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            TradingMarket: {
                id: FieldId.TradingMarket,
                dataTypeId: FieldDataTypeId.Text,
                subbed: false,
                comparable: false,
            },
            ValueTraded: {
                id: FieldId.ValueTraded,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            Volume: {
                id: FieldId.Volume,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
            VWAP: {
                id: FieldId.VWAP,
                dataTypeId: FieldDataTypeId.Numeric,
                subbed: false,
                comparable: true,
            },
        } as const;

        const infos = Object.values(infosObject);
        export const idCount = infos.length;

        export function initialise() {
            for (let id = 0; id < idCount; id++) {
                if (id !== infosObject[id].id) {
                    throw new EnumInfoOutOfOrderError('ScanCriteria.Field', id, `${id}`);
                }
            }
        }

        export function idToDataTypeId(id: Id) {
            return infos[id].dataTypeId;
        }

        export function isSubbed(id: Id) {
            return infos[id].subbed;
        }

        export function isComparable(id: Id) {
            return infos[id].comparable;
        }
    }

    export type BooleanFieldId = PickEnum<FieldId,
        FieldId.IsIndex
    >;

    export type NumericFieldId = PickEnum<FieldId,
        FieldId.Auction |
        FieldId.AuctionLast |
        FieldId.AuctionQuantity |
        FieldId.BestAskCount |
        FieldId.BestAskPrice |
        FieldId.BestAskQuantity |
        FieldId.BestBidCount |
        FieldId.BestBidPrice |
        FieldId.BestBidQuantity |
        FieldId.ClosePrice |
        FieldId.ContractSize |
        FieldId.HighPrice |
        FieldId.LastPrice |
        FieldId.LotSize |
        FieldId.LowPrice |
        FieldId.OpenInterest |
        FieldId.OpenPrice |
        FieldId.PreviousClose |
        FieldId.Remainder |
        FieldId.ShareIssue |
        FieldId.StrikePrice |
        FieldId.Trades |
        FieldId.ValueTraded |
        FieldId.Volume |
        FieldId.VWAP
    >;

    export type DateFieldId = PickEnum<FieldId,
        FieldId.ExpiryDate
    >;

    export type TextFieldId = PickEnum<FieldId,
        FieldId.Board |
        FieldId.CallOrPut |
        FieldId.Category |
        FieldId.CFI |
        FieldId.Class |
        FieldId.Code |
        FieldId.Currency |
        FieldId.Data |
        FieldId.Exchange |
        FieldId.ExerciseType |
        FieldId.Leg |
        FieldId.Market |
        FieldId.Name |
        FieldId.QuotationBasis |
        FieldId.State |
        FieldId.StateAllows |
        FieldId.StatusNote |
        FieldId.TradingMarket
    >;

    export const enum FieldDataTypeId {
        Numeric,
        Date,
        Text,
        Boolean,
    }

    export const enum PriceSubFieldId {
        Last,
    }

    export const enum DateSubFieldId {
        Dividend,
    }

    export const enum AltCodeSubFieldId {
        Ticker,
        Isin,
        Base,
        Gics,
        Ric,
        Short,
        Long,
        Uid,
    }

    export const enum AttributeSubFieldId {
        Category,
        Class,
        Delivery,
        MaxRss,
        Sector,
        Short,
        ShortSuspended,
        SubSector,
    }
}
