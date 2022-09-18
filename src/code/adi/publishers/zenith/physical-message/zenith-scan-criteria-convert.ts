/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { UnexpectedCaseError, UnreachableCaseError } from '../../../../sys/sys-internal-api';
import { ScanCriteria } from '../../../common/scan-criteria';
import { Zenith } from './zenith';
import { ZenithConvert } from './zenith-convert';
import { ZenithScanCriteria } from './zenith-scan-criteria';

export namespace ZenithScanCriteriaConvert {
    export function toNode() /* ScanCriteria.BooleanNode*/ {
        //
    }

    export function fromNode(node: ScanCriteria.BooleanNode): ZenithScanCriteria.BooleanNode {
        return fromBooleanNode(node)
    }

    function fromBooleanNode(node: ScanCriteria.BooleanNode): ZenithScanCriteria.AnyNode {
        switch (node.typeId) {
            case ScanCriteria.NodeTypeId.And: return fromMultiOperandBooleanNode('And', node as ScanCriteria.MultiOperandBooleanNode);
            case ScanCriteria.NodeTypeId.Or: return fromMultiOperandBooleanNode('Or', node as ScanCriteria.MultiOperandBooleanNode);
            case ScanCriteria.NodeTypeId.Not: return fromSingleOperandBooleanNode('Not', node as ScanCriteria.SingleOperandBooleanNode);
            case ScanCriteria.NodeTypeId.NumericEquals: return fromNumericComparisonNode('=', node as ScanCriteria.NumericComparisonBooleanNode);
            case ScanCriteria.NodeTypeId.NumericGreaterThan: return fromNumericComparisonNode('>', node as ScanCriteria.NumericComparisonBooleanNode);
            case ScanCriteria.NodeTypeId.NumericGreaterThanOrEqual: return fromNumericComparisonNode('>=', node as ScanCriteria.NumericComparisonBooleanNode);
            case ScanCriteria.NodeTypeId.NumericLessThan: return fromNumericComparisonNode('<', node as ScanCriteria.NumericComparisonBooleanNode);
            case ScanCriteria.NodeTypeId.NumericLessThanOrEqual: return fromNumericComparisonNode('<=', node as ScanCriteria.NumericComparisonBooleanNode);
            case ScanCriteria.NodeTypeId.All: return ['All'];
            case ScanCriteria.NodeTypeId.None: return ['None'];
            // case ScanCriteria.NodeTypeId.BooleanFieldHasValue: return;
            case ScanCriteria.NodeTypeId.BooleanFieldEquals: return fromBooleanFieldEqualsNode(node as ScanCriteria.BooleanFieldEqualsNode);
            case ScanCriteria.NodeTypeId.NumericFieldHasValue: return fromNumericFieldHasValueNode(node as ScanCriteria.NumericFieldHasValueNode);
            case ScanCriteria.NodeTypeId.NumericFieldEquals: return fromNumericFieldEqualsNode(node as ScanCriteria.NumericFieldEqualsNode);
            case ScanCriteria.NodeTypeId.NumericFieldInRange: return fromNumericFieldInRangeNode(node as ScanCriteria.NumericFieldInRangeNode);
            case ScanCriteria.NodeTypeId.DateFieldHasValue: return fromDateFieldHasValueNode(node as ScanCriteria.DateFieldHasValueNode);
            case ScanCriteria.NodeTypeId.DateFieldEquals: return fromDateFieldEqualsNode(node as ScanCriteria.DateFieldEqualsNode);
            case ScanCriteria.NodeTypeId.DateFieldInRange: return fromDateFieldInRangeNode(node as ScanCriteria.DateFieldInRangeNode);
            case ScanCriteria.NodeTypeId.TextFieldHasValue: return fromTextFieldHasValueNode(node as ScanCriteria.TextFieldHasValueNode);
            case ScanCriteria.NodeTypeId.TextFieldContains: return fromTextFieldContainsNode(node as ScanCriteria.TextFieldContainsNode);
            case ScanCriteria.NodeTypeId.PriceSubFieldHasValue: return fromPriceSubHasValueNode(node as ScanCriteria.PriceSubFieldHasValueNode);
            case ScanCriteria.NodeTypeId.PriceSubFieldEquals: return fromPriceSubFieldEqualsNode(node as ScanCriteria.PriceSubFieldEqualsNode);
            case ScanCriteria.NodeTypeId.PriceSubFieldInRange: return fromPriceSubFieldInRangeNode(node as ScanCriteria.PriceSubFieldInRangeNode);
            case ScanCriteria.NodeTypeId.DateSubFieldHasValue: return fromDateSubFieldHasValueNode(node as ScanCriteria.DateSubFieldHasValueNode)
            case ScanCriteria.NodeTypeId.DateSubFieldEquals: return fromDateSubFieldEqualsNode(node as ScanCriteria.DateSubFieldEqualsNode);
            case ScanCriteria.NodeTypeId.DateSubFieldInRange: return fromDateSubFieldInRangeNode(node as ScanCriteria.DateSubFieldInRangeNode);
            case ScanCriteria.NodeTypeId.AltCodeSubFieldHasValue: return fromAltCodeSubFieldHasValueNode(node as ScanCriteria.AltCodeSubFieldHasValueNode);
            case ScanCriteria.NodeTypeId.AltCodeSubFieldContains: return fromAltCodeSubFieldContainsNode(node as ScanCriteria.AltCodeSubFieldContainsNode);
            case ScanCriteria.NodeTypeId.AttributeSubFieldHasValue: return fromAttributeSubFieldHasValueNode(node as ScanCriteria.AttributeSubFieldHasValueNode);
            case ScanCriteria.NodeTypeId.AttributeSubFieldContains: return fromAttributeSubFieldContainsNode(node as ScanCriteria.AttributeSubFieldContainsNode);
            default:
                throw new UnreachableCaseError('ZSCCFBN90042', node.typeId)
        }
    }

    function fromMultiOperandBooleanNode(type: 'And' | 'Or', node: ScanCriteria.MultiOperandBooleanNode): ZenithScanCriteria.LogicalNode {
        const params = fromBooleanParams(node.operands);
        return [type, ...params];
    }

    function fromSingleOperandBooleanNode(type: 'Not', node: ScanCriteria.SingleOperandBooleanNode): ZenithScanCriteria.LogicalNode {
        const param = fromBooleanNode(node);
        return [type, param];
    }

    function fromNumericComparisonNode(type: '=' | '>' | '>=' | '<' | '<=', node: ScanCriteria.NumericComparisonBooleanNode): ZenithScanCriteria.ComparisonNode {
        const leftOperand = fromNumericOperand(node.leftOperand);
        const rightOperand = fromNumericOperand(node.leftOperand);
        return [type, leftOperand, rightOperand];
    }

    function fromBooleanParams(paramNodes: ScanCriteria.BooleanNode[]): ZenithScanCriteria.BooleanNode[] {
        const count = paramNodes.length;
        const params = new Array<ZenithScanCriteria.BooleanNode>(count);
        for (let i = 0; i < count; i++) {
            const paramNode = paramNodes[i];
            const param = fromBooleanNode(paramNode);
            params[i] = param;
        }
        return params;
    }

    function fromNumericOperand(operand: ScanCriteria.NumericNode | number): ZenithScanCriteria.NumericParam {
        if (operand instanceof ScanCriteria.NumericNode) {
            return fromNumericNodeParam(operand)
        } else {
            return operand;
        }
    }

    function fromNumericNodeParam(node: ScanCriteria.NumericNode): ZenithScanCriteria.NumericParam {
        switch (node.typeId) {
            case ScanCriteria.NodeTypeId.NumericAdd: return fromLeftRightArithmeticNumericNodeParam('Add', node as ScanCriteria.LeftRightArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericDiv: return fromLeftRightArithmeticNumericNodeParam('Div', node as ScanCriteria.LeftRightArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericMod: return fromLeftRightArithmeticNumericNodeParam('Mod', node as ScanCriteria.LeftRightArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericMul: return fromLeftRightArithmeticNumericNodeParam('Mul', node as ScanCriteria.LeftRightArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericSub: return fromLeftRightArithmeticNumericNodeParam('Sub', node as ScanCriteria.LeftRightArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericNeg: return fromUnaryArithmeticNumericNodeParam('Neg', node as ScanCriteria.UnaryArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericPos: return fromUnaryArithmeticNumericNodeParam('Pos', node as ScanCriteria.UnaryArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericAbs: return fromUnaryArithmeticNumericNodeParam('Abs', node as ScanCriteria.UnaryArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericFieldValueGet: return fromNumericFieldValueGetNode(node as ScanCriteria.NumericFieldValueGetNode);
            default:
                throw new UnreachableCaseError('ZSCCFNNPU', node.typeId);
        }
    }

    function fromUnaryArithmeticNumericNodeParam(
        type: 'Neg' | 'Pos' | 'Abs',
        node: ScanCriteria.UnaryArithmeticNumericNode
    ): ZenithScanCriteria.UnaryExpressionNode {
        const operand = node.operand;
        let param: ZenithScanCriteria.NumericParam;
        if (operand instanceof ScanCriteria.NumericNode) {
            param = fromNumericNodeParam(operand);
        } else {
            param = operand;
        }

        return [type, param];
    }

    function fromLeftRightArithmeticNumericNodeParam(
        type: 'Add' | 'Div' | 'Mod' | 'Mul' | 'Sub',
        node: ScanCriteria.LeftRightArithmeticNumericNode
    ): ZenithScanCriteria.BinaryExpressionNode {
        const leftOperand = node.leftOperand;
        let leftParam: ZenithScanCriteria.NumericParam;
        if (leftOperand instanceof ScanCriteria.NumericNode) {
            leftParam = fromNumericNodeParam(leftOperand);
        } else {
            leftParam = leftOperand;
        }

        const rightOperand = node.rightOperand;
        let rightParam: ZenithScanCriteria.NumericParam;
        if (rightOperand instanceof ScanCriteria.NumericNode) {
            rightParam = fromNumericNodeParam(rightOperand);
        } else {
            rightParam = rightOperand;
        }

        return [type, leftParam, rightParam];
    }

    function fromNumericFieldValueGetNode(node: ScanCriteria.NumericFieldValueGetNode): ZenithScanCriteria.ComparableField {
        return Field.numericFromId(node.fieldId);
    }

    function fromBooleanFieldEqualsNode(node: ScanCriteria.BooleanFieldEqualsNode): ZenithScanCriteria.MatchingNode {
        const field = Field.booleanFromId(node.fieldId);
        const target = node.target;
        return [field, target];
    }

    function fromNumericFieldHasValueNode(node: ScanCriteria.NumericFieldHasValueNode): ZenithScanCriteria.MatchingNode {
        const field = Field.numericFromId(node.fieldId);
        return [field];
    }

    function fromNumericFieldEqualsNode(node: ScanCriteria.NumericFieldEqualsNode): ZenithScanCriteria.MatchingNode {
        const field = Field.numericFromId(node.fieldId);
        const target = node.target;
        return [field, target];
    }

    function fromNumericFieldInRangeNode(node: ScanCriteria.NumericFieldInRangeNode): ZenithScanCriteria.MatchingNode {
        const field = Field.numericFromId(node.fieldId);
        const namedParameters: ZenithScanCriteria.NumericNamedParameters = {
            Min: node.min,
            Max: node.max,
        }
        return [field, namedParameters];
    }

    function fromDateFieldHasValueNode(node: ScanCriteria.DateFieldHasValueNode): ZenithScanCriteria.MatchingNode {
        const field = Field.dateFromId(node.fieldId);
        return [field];
    }

    function fromDateFieldEqualsNode(node: ScanCriteria.DateFieldEqualsNode): ZenithScanCriteria.MatchingNode {
        const field = Field.dateFromId(node.fieldId);
        const target = DateValue.fromDate(node.target);
        return [field, target];
    }

    function fromDateFieldInRangeNode(node: ScanCriteria.DateFieldInRangeNode): ZenithScanCriteria.MatchingNode {
        const field = Field.dateFromId(node.fieldId);
        const nodeMin = node.min;
        const nodeMax = node.max;
        const namedParameters: ZenithScanCriteria.DateNamedParameters = {
            Min: nodeMin === undefined ? undefined: DateValue.fromDate(nodeMin),
            Max: nodeMax === undefined ? undefined: DateValue.fromDate(nodeMax),
        }
        return [field, namedParameters];
    }

    function fromTextFieldHasValueNode(node: ScanCriteria.TextFieldHasValueNode): ZenithScanCriteria.MatchingNode {
        const field = Field.textFromId(node.fieldId);
        return [field];
    }

    function fromTextFieldContainsNode(node: ScanCriteria.TextFieldContainsNode): ZenithScanCriteria.MatchingNode {
        const field = Field.textFromId(node.fieldId);
        const value = node.value;
        const as = TextContainsAs.fromId(node.as);
        const namedParameters: ZenithScanCriteria.TextNamedParameters = {
            As: as,
            IgnoreCase: node.ignoreCase,
        }
        return [field, value, namedParameters];
    }

    function fromPriceSubHasValueNode(node: ScanCriteria.PriceSubFieldHasValueNode): ZenithScanCriteria.MatchingNode {
        const field = ZenithScanCriteria.MatchingFieldEnum.Price;
        const subField = PriceSubField.fromId(node.subFieldId);
        return [field, subField];
    }

    function fromPriceSubFieldEqualsNode(node: ScanCriteria.PriceSubFieldEqualsNode): ZenithScanCriteria.MatchingNode {
        const field = ZenithScanCriteria.MatchingFieldEnum.Price;
        const subField = PriceSubField.fromId(node.subFieldId);
        const target = node.target;
        return [field, subField, target];
    }

    function fromPriceSubFieldInRangeNode(node: ScanCriteria.PriceSubFieldInRangeNode): ZenithScanCriteria.MatchingNode {
        const field = ZenithScanCriteria.MatchingFieldEnum.Price;
        const subField = PriceSubField.fromId(node.subFieldId);
        const namedParameters: ZenithScanCriteria.NumericNamedParameters = {
            Min: node.min,
            Max: node.max,
        }
        return [field, subField, namedParameters];
    }

    function fromDateSubFieldHasValueNode(node: ScanCriteria.DateSubFieldHasValueNode): ZenithScanCriteria.MatchingNode {
        const field = ZenithScanCriteria.MatchingFieldEnum.Date;
        const subField = DateSubField.fromId(node.subFieldId);
        return [field, subField];
    }

    function fromDateSubFieldEqualsNode(node: ScanCriteria.DateSubFieldEqualsNode): ZenithScanCriteria.MatchingNode {
        const field = ZenithScanCriteria.MatchingFieldEnum.Date;
        const subField = DateSubField.fromId(node.subFieldId);
        const target = DateValue.fromDate(node.target);
        return [field, subField, target];
    }

    function fromDateSubFieldInRangeNode(node: ScanCriteria.DateSubFieldInRangeNode): ZenithScanCriteria.MatchingNode {
        const field = ZenithScanCriteria.MatchingFieldEnum.Date;
        const subField = DateSubField.fromId(node.subFieldId);
        const nodeMin = node.min;
        const nodeMax = node.max;
        const namedParameters: ZenithScanCriteria.DateNamedParameters = {
            Min: nodeMin === undefined ? undefined: DateValue.fromDate(nodeMin),
            Max: nodeMax === undefined ? undefined: DateValue.fromDate(nodeMax),
        }
        return [field, subField, namedParameters];
    }

    function fromAltCodeSubFieldHasValueNode(node: ScanCriteria.AltCodeSubFieldHasValueNode): ZenithScanCriteria.MatchingNode {
        const field = ZenithScanCriteria.MatchingFieldEnum.AltCode;
        const subField = AltCodeSubField.fromId(node.subFieldId);
        return [field, subField];
    }

    function fromAltCodeSubFieldContainsNode(node: ScanCriteria.AltCodeSubFieldContainsNode): ZenithScanCriteria.MatchingNode {
        const field = ZenithScanCriteria.MatchingFieldEnum.AltCode;
        const subField = AltCodeSubField.fromId(node.subFieldId);
        const as = TextContainsAs.fromId(node.as);
        const namedParameters: ZenithScanCriteria.TextNamedParameters = {
            As: as,
            IgnoreCase: node.ignoreCase,
        }
        return [field, subField, namedParameters];
    }

    function fromAttributeSubFieldHasValueNode(node: ScanCriteria.AttributeSubFieldHasValueNode): ZenithScanCriteria.MatchingNode {
        const field = ZenithScanCriteria.MatchingFieldEnum.Attribute;
        const subField = AttributeSubField.fromId(node.subFieldId);
        return [field, subField];
    }

    function fromAttributeSubFieldContainsNode(node: ScanCriteria.AttributeSubFieldContainsNode): ZenithScanCriteria.MatchingNode {
        const field = ZenithScanCriteria.MatchingFieldEnum.Attribute;
        const subField = AttributeSubField.fromId(node.subFieldId);
        const as = TextContainsAs.fromId(node.as);
        const namedParameters: ZenithScanCriteria.TextNamedParameters = {
            As: as,
            IgnoreCase: node.ignoreCase,
        }
        return [field, subField, namedParameters];
    }



    // function fromDateNode(node: ScanCriteria.DateNode): ZenithScanCriteria.DateRangeParams | ZenithScanCriteria.DateNamedRangeParams {
    //     switch (node.typeId) {
    //         case ScanCriteria.NodeTypeId.DateFieldValueGet: return fromDateFieldValueGetNode(node as ScanCriteria.DateFieldValueGetNode);
    //         case ScanCriteria.NodeTypeId.DateSubFieldValueGet: return fromDateSubFieldValueGetScanCriteriaNode(node as ScanCriteria.DateSubFieldValueGetNode);
    //         default:
    //             throw new UnexpectedCaseError('ZSCCFDN34423');
    //     }
    // }

    // function fromDateFieldValueGetNode(node: ScanCriteria.DateFieldValueGetNode): ZenithScanCriteria.DateRangeParams {
    //     return [Field.dateFromId(node.fieldId)];
    // }

    // function fromDateSubFieldValueGetScanCriteriaNode(node: ScanCriteria.DateSubFieldValueGetNode): ZenithScanCriteria.DateNamedRangeParams {
    //     return [Field.dateFromId(node.fieldId), DateSubField.fromId(node.subFieldId)];
    // }

    namespace Field {
        export function tryDateToId(value: ZenithScanCriteria.MatchingFieldEnum): ScanCriteria.DateFieldId | undefined {
            switch (value) {
                // case ZenithScanCriteria.MatchingFieldEnum.Date: return ScanCriteria.FieldId.Date;
                case ZenithScanCriteria.MatchingFieldEnum.ExpiryDate: return ScanCriteria.FieldId.ExpiryDate;
                default: return undefined;
            }
        }

        export function dateFromId(value: ScanCriteria.DateFieldId) {
            switch (value) {
                // case ScanCriteria.FieldId.Date: return ZenithScanCriteria.MatchingFieldEnum.Date;
                case ScanCriteria.FieldId.ExpiryDate: return ZenithScanCriteria.MatchingFieldEnum.ExpiryDate;
                default:
                    throw new UnexpectedCaseError('ZSCCDFFI16179', `${value}`);
            }
        }

        export function tryNumericToId(value: ZenithScanCriteria.MatchingFieldEnum): ScanCriteria.NumericFieldId | undefined {
            switch (value) {
                case ZenithScanCriteria.MatchingFieldEnum.Auction: return ScanCriteria.FieldId.Auction;
                case ZenithScanCriteria.MatchingFieldEnum.AuctionLast: return ScanCriteria.FieldId.AuctionLast;
                case ZenithScanCriteria.MatchingFieldEnum.AuctionQuantity: return ScanCriteria.FieldId.AuctionQuantity;
                case ZenithScanCriteria.MatchingFieldEnum.BestAskCount: return ScanCriteria.FieldId.BestAskCount;
                case ZenithScanCriteria.MatchingFieldEnum.BestAskPrice: return ScanCriteria.FieldId.BestAskPrice;
                case ZenithScanCriteria.MatchingFieldEnum.BestAskQuantity: return ScanCriteria.FieldId.BestAskQuantity;
                case ZenithScanCriteria.MatchingFieldEnum.BestBidCount: return ScanCriteria.FieldId.BestBidCount;
                case ZenithScanCriteria.MatchingFieldEnum.BestBidPrice: return ScanCriteria.FieldId.BestBidPrice;
                case ZenithScanCriteria.MatchingFieldEnum.BestBidQuantity: return ScanCriteria.FieldId.BestBidQuantity;
                case ZenithScanCriteria.MatchingFieldEnum.ClosePrice: return ScanCriteria.FieldId.ClosePrice;
                case ZenithScanCriteria.MatchingFieldEnum.ContractSize: return ScanCriteria.FieldId.ContractSize;
                case ZenithScanCriteria.MatchingFieldEnum.HighPrice: return ScanCriteria.FieldId.HighPrice;
                case ZenithScanCriteria.MatchingFieldEnum.LastPrice: return ScanCriteria.FieldId.LastPrice;
                case ZenithScanCriteria.MatchingFieldEnum.LotSize: return ScanCriteria.FieldId.LotSize;
                case ZenithScanCriteria.MatchingFieldEnum.LowPrice: return ScanCriteria.FieldId.LowPrice;
                case ZenithScanCriteria.MatchingFieldEnum.OpenInterest: return ScanCriteria.FieldId.OpenInterest;
                case ZenithScanCriteria.MatchingFieldEnum.OpenPrice: return ScanCriteria.FieldId.OpenPrice;
                // case ZenithScanCriteria.MatchingFieldEnum.Price: return ScanCriteria.FieldId.Price;
                case ZenithScanCriteria.MatchingFieldEnum.PreviousClose: return ScanCriteria.FieldId.PreviousClose;
                case ZenithScanCriteria.MatchingFieldEnum.Remainder: return ScanCriteria.FieldId.Remainder;
                case ZenithScanCriteria.MatchingFieldEnum.ShareIssue: return ScanCriteria.FieldId.ShareIssue;
                case ZenithScanCriteria.MatchingFieldEnum.StrikePrice: return ScanCriteria.FieldId.StrikePrice;
                case ZenithScanCriteria.MatchingFieldEnum.Trades: return ScanCriteria.FieldId.Trades;
                case ZenithScanCriteria.MatchingFieldEnum.ValueTraded: return ScanCriteria.FieldId.ValueTraded;
                case ZenithScanCriteria.MatchingFieldEnum.Volume: return ScanCriteria.FieldId.Volume;
                case ZenithScanCriteria.MatchingFieldEnum.VWAP: return ScanCriteria.FieldId.VWAP;
                default: return undefined;
            }
        }

        export function numericFromId(value: ScanCriteria.NumericFieldId) {
            switch (value) {
                case ScanCriteria.FieldId.Auction: return ZenithScanCriteria.MatchingFieldEnum.Auction;
                case ScanCriteria.FieldId.AuctionLast: return ZenithScanCriteria.MatchingFieldEnum.AuctionLast;
                case ScanCriteria.FieldId.AuctionQuantity: return ZenithScanCriteria.MatchingFieldEnum.AuctionQuantity;
                case ScanCriteria.FieldId.BestAskCount: return ZenithScanCriteria.MatchingFieldEnum.BestAskCount;
                case ScanCriteria.FieldId.BestAskPrice: return ZenithScanCriteria.MatchingFieldEnum.BestAskPrice;
                case ScanCriteria.FieldId.BestAskQuantity: return ZenithScanCriteria.MatchingFieldEnum.BestAskQuantity;
                case ScanCriteria.FieldId.BestBidCount: return ZenithScanCriteria.MatchingFieldEnum.BestBidCount;
                case ScanCriteria.FieldId.BestBidPrice: return ZenithScanCriteria.MatchingFieldEnum.BestBidPrice;
                case ScanCriteria.FieldId.BestBidQuantity: return ZenithScanCriteria.MatchingFieldEnum.BestBidQuantity;
                case ScanCriteria.FieldId.ClosePrice: return ZenithScanCriteria.MatchingFieldEnum.ClosePrice;
                case ScanCriteria.FieldId.ContractSize: return ZenithScanCriteria.MatchingFieldEnum.ContractSize;
                case ScanCriteria.FieldId.HighPrice: return ZenithScanCriteria.MatchingFieldEnum.HighPrice;
                case ScanCriteria.FieldId.LastPrice: return ZenithScanCriteria.MatchingFieldEnum.LastPrice;
                case ScanCriteria.FieldId.LotSize: return ZenithScanCriteria.MatchingFieldEnum.LotSize;
                case ScanCriteria.FieldId.LowPrice: return ZenithScanCriteria.MatchingFieldEnum.LowPrice;
                case ScanCriteria.FieldId.OpenInterest: return ZenithScanCriteria.MatchingFieldEnum.OpenInterest;
                case ScanCriteria.FieldId.OpenPrice: return ZenithScanCriteria.MatchingFieldEnum.OpenPrice;
                // case ScanCriteria.FieldId.Price: return ZenithScanCriteria.MatchingFieldEnum.Price;
                case ScanCriteria.FieldId.PreviousClose: return ZenithScanCriteria.MatchingFieldEnum.PreviousClose;
                case ScanCriteria.FieldId.Remainder: return ZenithScanCriteria.MatchingFieldEnum.Remainder;
                case ScanCriteria.FieldId.ShareIssue: return ZenithScanCriteria.MatchingFieldEnum.ShareIssue;
                case ScanCriteria.FieldId.StrikePrice: return ZenithScanCriteria.MatchingFieldEnum.StrikePrice;
                case ScanCriteria.FieldId.Trades: return ZenithScanCriteria.MatchingFieldEnum.Trades;
                case ScanCriteria.FieldId.ValueTraded: return ZenithScanCriteria.MatchingFieldEnum.ValueTraded;
                case ScanCriteria.FieldId.Volume: return ZenithScanCriteria.MatchingFieldEnum.Volume;
                case ScanCriteria.FieldId.VWAP: return ZenithScanCriteria.MatchingFieldEnum.VWAP;
                default:
                    throw new UnreachableCaseError('ZSCCFNFI16179', value);
            }
        }

        export function textFromId(value: ScanCriteria.TextFieldId) {
            switch (value) {
                case ScanCriteria.FieldId.Board: return ZenithScanCriteria.MatchingFieldEnum.Board;
                case ScanCriteria.FieldId.CallOrPut: return ZenithScanCriteria.MatchingFieldEnum.CallOrPut;
                case ScanCriteria.FieldId.Category: return ZenithScanCriteria.MatchingFieldEnum.Category;
                case ScanCriteria.FieldId.CFI: return ZenithScanCriteria.MatchingFieldEnum.CFI;
                case ScanCriteria.FieldId.Class: return ZenithScanCriteria.MatchingFieldEnum.Class;
                case ScanCriteria.FieldId.Code: return ZenithScanCriteria.MatchingFieldEnum.Code;
                case ScanCriteria.FieldId.Currency: return ZenithScanCriteria.MatchingFieldEnum.Currency;
                case ScanCriteria.FieldId.Data: return ZenithScanCriteria.MatchingFieldEnum.Data;
                case ScanCriteria.FieldId.Exchange: return ZenithScanCriteria.MatchingFieldEnum.Exchange;
                case ScanCriteria.FieldId.ExerciseType: return ZenithScanCriteria.MatchingFieldEnum.ExerciseType;
                case ScanCriteria.FieldId.Leg: return ZenithScanCriteria.MatchingFieldEnum.Leg;
                case ScanCriteria.FieldId.Market: return ZenithScanCriteria.MatchingFieldEnum.Market;
                case ScanCriteria.FieldId.Name: return ZenithScanCriteria.MatchingFieldEnum.Name;
                case ScanCriteria.FieldId.QuotationBasis: return ZenithScanCriteria.MatchingFieldEnum.QuotationBasis;
                case ScanCriteria.FieldId.State: return ZenithScanCriteria.MatchingFieldEnum.State;
                case ScanCriteria.FieldId.StateAllows: return ZenithScanCriteria.MatchingFieldEnum.StateAllows;
                case ScanCriteria.FieldId.StatusNote: return ZenithScanCriteria.MatchingFieldEnum.StatusNote;
                case ScanCriteria.FieldId.TradingMarket: return ZenithScanCriteria.MatchingFieldEnum.TradingMarket;
                default:
                    throw new UnreachableCaseError('ZSCCFBFI16179', value);
            }
        }

        export function booleanFromId(value: ScanCriteria.BooleanFieldId) {
            switch (value) {
                case ScanCriteria.FieldId.IsIndex: return ZenithScanCriteria.MatchingFieldEnum.IsIndex;
                default:
                    throw new UnreachableCaseError('ZSCCFBFI16179', value);
            }
        }
    }

    namespace PriceSubField {
        export function toId(value: ZenithScanCriteria.MatchingPriceSubFieldEnum): ScanCriteria.PriceSubFieldId {
            switch (value) {
                case ZenithScanCriteria.MatchingPriceSubFieldEnum.LastPrice: return ScanCriteria.PriceSubFieldId.Last;
                default:
                    throw new UnreachableCaseError('ZSCCPSFTI16179', value);
            }
        }

        export function fromId(value: ScanCriteria.PriceSubFieldId): ZenithScanCriteria.MatchingPriceSubFieldEnum {
            switch (value) {
                case ScanCriteria.PriceSubFieldId.Last: return ZenithScanCriteria.MatchingPriceSubFieldEnum.LastPrice;
                default:
                    throw new UnreachableCaseError('ZSCCPSFFI16179', value);
            }
        }
    }

    namespace DateSubField {
        export function toId(value: ZenithScanCriteria.MatchingDateSubFieldEnum): ScanCriteria.DateSubFieldId {
            switch (value) {
                case ZenithScanCriteria.MatchingDateSubFieldEnum.Dividend: return ScanCriteria.DateSubFieldId.Dividend;
                default:
                    throw new UnreachableCaseError('ZSCCDSFTI16179', value);
            }
        }

        export function fromId(value: ScanCriteria.DateSubFieldId): ZenithScanCriteria.MatchingDateSubFieldEnum {
            switch (value) {
                case ScanCriteria.DateSubFieldId.Dividend: return ZenithScanCriteria.MatchingDateSubFieldEnum.Dividend;
                default:
                    throw new UnreachableCaseError('ZSCCDSFFI16179', value);
            }
        }
    }

    namespace AltCodeSubField {
        export function toId(value: Zenith.MarketController.SearchSymbols.AlternateKey): ScanCriteria.AltCodeSubFieldId {
            switch (value) {
                case Zenith.MarketController.SearchSymbols.AlternateKey.Ticker: return ScanCriteria.AltCodeSubFieldId.Ticker;
                case Zenith.MarketController.SearchSymbols.AlternateKey.Isin: return ScanCriteria.AltCodeSubFieldId.Isin;
                case Zenith.MarketController.SearchSymbols.AlternateKey.Base: return ScanCriteria.AltCodeSubFieldId.Base;
                case Zenith.MarketController.SearchSymbols.AlternateKey.Gics: return ScanCriteria.AltCodeSubFieldId.Gics;
                case Zenith.MarketController.SearchSymbols.AlternateKey.Ric: return ScanCriteria.AltCodeSubFieldId.Ric;
                case Zenith.MarketController.SearchSymbols.AlternateKey.Short: return ScanCriteria.AltCodeSubFieldId.Short;
                case Zenith.MarketController.SearchSymbols.AlternateKey.Long: return ScanCriteria.AltCodeSubFieldId.Long;
                case Zenith.MarketController.SearchSymbols.AlternateKey.Uid: return ScanCriteria.AltCodeSubFieldId.Uid;
                default:
                    throw new UnreachableCaseError('ZSCCACSFTI16179', value);
            }
        }

        export function fromId(value: ScanCriteria.AltCodeSubFieldId): Zenith.MarketController.SearchSymbols.AlternateKey {
            switch (value) {
                case ScanCriteria.AltCodeSubFieldId.Ticker: return Zenith.MarketController.SearchSymbols.AlternateKey.Ticker;
                case ScanCriteria.AltCodeSubFieldId.Isin: return Zenith.MarketController.SearchSymbols.AlternateKey.Isin;
                case ScanCriteria.AltCodeSubFieldId.Base: return Zenith.MarketController.SearchSymbols.AlternateKey.Base;
                case ScanCriteria.AltCodeSubFieldId.Gics: return Zenith.MarketController.SearchSymbols.AlternateKey.Gics;
                case ScanCriteria.AltCodeSubFieldId.Ric: return Zenith.MarketController.SearchSymbols.AlternateKey.Ric;
                case ScanCriteria.AltCodeSubFieldId.Short: return Zenith.MarketController.SearchSymbols.AlternateKey.Short;
                case ScanCriteria.AltCodeSubFieldId.Long: return Zenith.MarketController.SearchSymbols.AlternateKey.Long;
                case ScanCriteria.AltCodeSubFieldId.Uid: return Zenith.MarketController.SearchSymbols.AlternateKey.Uid;
                default:
                    throw new UnreachableCaseError('ZSCCACSFFI16179', value);
            }
        }
    }

    namespace AttributeSubField {
        export function toId(value: Zenith.MarketController.SearchSymbols.KnownAttributeKey): ScanCriteria.AttributeSubFieldId {
            switch (value) {
                case Zenith.MarketController.SearchSymbols.KnownAttributeKey.Category: return ScanCriteria.AttributeSubFieldId.Category;
                case Zenith.MarketController.SearchSymbols.KnownAttributeKey.Class: return ScanCriteria.AttributeSubFieldId.Class;
                case Zenith.MarketController.SearchSymbols.KnownAttributeKey.Delivery: return ScanCriteria.AttributeSubFieldId.Delivery;
                case Zenith.MarketController.SearchSymbols.KnownAttributeKey.Sector: return ScanCriteria.AttributeSubFieldId.Sector;
                case Zenith.MarketController.SearchSymbols.KnownAttributeKey.Short: return ScanCriteria.AttributeSubFieldId.Short;
                case Zenith.MarketController.SearchSymbols.KnownAttributeKey.ShortSuspended: return ScanCriteria.AttributeSubFieldId.ShortSuspended;
                case Zenith.MarketController.SearchSymbols.KnownAttributeKey.SubSector: return ScanCriteria.AttributeSubFieldId.SubSector;
                case Zenith.MarketController.SearchSymbols.KnownAttributeKey.MaxRss: return ScanCriteria.AttributeSubFieldId.MaxRss;

                default:
                    throw new UnreachableCaseError('ZSCCATSFTI16179', value);
            }
        }

        export function fromId(value: ScanCriteria.AttributeSubFieldId): Zenith.MarketController.SearchSymbols.KnownAttributeKey {
            switch (value) {
                case ScanCriteria.AttributeSubFieldId.Category: return Zenith.MarketController.SearchSymbols.KnownAttributeKey.Category;
                case ScanCriteria.AttributeSubFieldId.Class: return Zenith.MarketController.SearchSymbols.KnownAttributeKey.Class;
                case ScanCriteria.AttributeSubFieldId.Delivery: return Zenith.MarketController.SearchSymbols.KnownAttributeKey.Delivery;
                case ScanCriteria.AttributeSubFieldId.Sector: return Zenith.MarketController.SearchSymbols.KnownAttributeKey.Sector;
                case ScanCriteria.AttributeSubFieldId.Short: return Zenith.MarketController.SearchSymbols.KnownAttributeKey.Short;
                case ScanCriteria.AttributeSubFieldId.ShortSuspended: return Zenith.MarketController.SearchSymbols.KnownAttributeKey.ShortSuspended;
                case ScanCriteria.AttributeSubFieldId.SubSector: return Zenith.MarketController.SearchSymbols.KnownAttributeKey.SubSector;
                case ScanCriteria.AttributeSubFieldId.MaxRss: return Zenith.MarketController.SearchSymbols.KnownAttributeKey.MaxRss;
                default:
                    throw new UnreachableCaseError('ZSCCATSFFI16179', value);
            }
        }
    }

    namespace DateValue {
        export function fromDate(value: Date): ZenithScanCriteria.DateString {
            return ZenithConvert.Date.DateTimeIso8601.fromDate(value);
        }
    }

    namespace TextContainsAs {
        export function fromId(value: ScanCriteria.TextContainsAsId) {
            switch (value) {
                case ScanCriteria.TextContainsAsId.None: return ZenithScanCriteria.TextContainsAsEnum.None;
                case ScanCriteria.TextContainsAsId.FromStart: return ZenithScanCriteria.TextContainsAsEnum.FromStart;
                case ScanCriteria.TextContainsAsId.FromEnd: return ZenithScanCriteria.TextContainsAsEnum.FromEnd;
                case ScanCriteria.TextContainsAsId.Exact: return ZenithScanCriteria.TextContainsAsEnum.Exact;
                default:
                    throw new UnreachableCaseError('ZSCCTCAFI51423', value);
            }
        }
    }
}
