/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { StringId, Strings } from '../../../../res/res-internal-api';
import { AssertInternalError, BaseZenithDataError, Err, ExternalError, Ok, Result, UnexpectedCaseError, UnreachableCaseError } from '../../../../sys/sys-internal-api';
import { ScanCriteria } from '../../../common/scan-criteria';
import { Zenith } from './zenith';
import { ZenithConvert } from './zenith-convert';
import { ZenithScanCriteria } from './zenith-scan-criteria';

export namespace ZenithScanCriteriaConvert {
    export class ParseProgress {
        private _nodeCount = 0;
        private _nodeDepth = 0;
        private _parsedNodes = new Array<ParseProgress.ParsedNode>(0);

        get tupleNodeCount() { return this._nodeCount; }
        get tupleNodeDepth() { return this._nodeDepth; }
        get parsedNodes(): readonly ParseProgress.ParsedNode[] { return this._parsedNodes; }

        enterTupleNode() {
            this._nodeDepth++;
            this._nodeCount++;
        }

        addParsedNode(nodeType: ZenithScanCriteria.TupleNodeType): ParseProgress.ParsedNode {
            const parsedNode: ParseProgress.ParsedNode = {
                nodeDepth: this._nodeDepth,
                tupleNodeType: nodeType,
                nodeTypeId: undefined,
            }
            this._parsedNodes.push(parsedNode);

            return parsedNode;
        }

        exitTupleNode(parsedNode: ParseProgress.ParsedNode, nodeTypeId: ScanCriteria.NodeTypeId) {
            parsedNode.nodeTypeId = nodeTypeId;
            this._nodeDepth--;
        }
    }

    export namespace ParseProgress {
        export interface ParsedNode {
            nodeDepth: number;
            tupleNodeType: ZenithScanCriteria.TupleNodeType;
            nodeTypeId: ScanCriteria.NodeTypeId | undefined;
        }
    }

    export interface ParsedBoolean {
        node: ScanCriteria.BooleanNode;
        progress: ParseProgress;
    }

    export class ZenithScanCriteriaParseError extends BaseZenithDataError {
        constructor(code: ExternalError.Code, message: string) {
            super(StringId.ZenithScanCriteriaParseError, code, message);
        }

        parseProgress: ParseProgress;
    }

    export function fromBooleanNode(node: ScanCriteria.BooleanNode): ZenithScanCriteria.BooleanTupleNode {
        switch (node.typeId) {
            case ScanCriteria.NodeTypeId.And: return fromMultiOperandBooleanNode(ZenithScanCriteria.AndTupleNodeType, node as ScanCriteria.MultiOperandBooleanNode);
            case ScanCriteria.NodeTypeId.Or: return fromMultiOperandBooleanNode(ZenithScanCriteria.OrTupleNodeType, node as ScanCriteria.MultiOperandBooleanNode);
            case ScanCriteria.NodeTypeId.Not: return fromSingleOperandBooleanNode(ZenithScanCriteria.NotTupleNodeType, node as ScanCriteria.SingleOperandBooleanNode);
            case ScanCriteria.NodeTypeId.NumericEquals: return fromNumericComparisonNode(ZenithScanCriteria.EqualTupleNodeType, node as ScanCriteria.NumericComparisonBooleanNode);
            case ScanCriteria.NodeTypeId.NumericGreaterThan: return fromNumericComparisonNode(ZenithScanCriteria.GreaterThanTupleNodeType, node as ScanCriteria.NumericComparisonBooleanNode);
            case ScanCriteria.NodeTypeId.NumericGreaterThanOrEqual: return fromNumericComparisonNode(ZenithScanCriteria.GreaterThanOrEqualTupleNodeType, node as ScanCriteria.NumericComparisonBooleanNode);
            case ScanCriteria.NodeTypeId.NumericLessThan: return fromNumericComparisonNode(ZenithScanCriteria.LessThanTupleNodeType, node as ScanCriteria.NumericComparisonBooleanNode);
            case ScanCriteria.NodeTypeId.NumericLessThanOrEqual: return fromNumericComparisonNode(ZenithScanCriteria.LessThanOrEqualTupleNodeType, node as ScanCriteria.NumericComparisonBooleanNode);
            case ScanCriteria.NodeTypeId.All: return [ZenithScanCriteria.AllTupleNodeType];
            case ScanCriteria.NodeTypeId.None: return [ZenithScanCriteria.NoneTupleNodeType];
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

    export function parseBoolean(node: ZenithScanCriteria.BooleanTupleNodeUnion): Result<ParsedBoolean, ZenithScanCriteriaParseError> {
        const parseProgress = new ParseProgress();

        const toResult = tryToExpectedBooleanNode(node, parseProgress);

        if (toResult.isOk()) {
            const parsedBoolean: ParsedBoolean = {
                node: toResult.value,
                progress: parseProgress,
            }
            return new Ok(parsedBoolean);
        } else {
            toResult.error.parseProgress = parseProgress;
            return toResult;
        }
    }

    function fromMultiOperandBooleanNode(
        type: typeof ZenithScanCriteria.AndTupleNodeType | typeof ZenithScanCriteria.OrTupleNodeType,
        node: ScanCriteria.MultiOperandBooleanNode
    ): ZenithScanCriteria.LogicalTupleNode {
        const operands = node.operands;
        const count = operands.length;
        const params = new Array<ZenithScanCriteria.BooleanParam>(count);
        for (let i = 0; i < count; i++) {
            const operand = operands[i];
            const tupleNode = fromBooleanNode(operand);
            params[i] = tupleNode;
        }

        return [type, ...params];
    }

    function fromSingleOperandBooleanNode(type: typeof ZenithScanCriteria.NotTupleNodeType, node: ScanCriteria.SingleOperandBooleanNode): ZenithScanCriteria.LogicalTupleNode {
        const param = fromBooleanNode(node);
        return [type, param];
    }

    function fromNumericComparisonNode(
        type:
            typeof ZenithScanCriteria.EqualTupleNodeType |
            typeof ZenithScanCriteria.GreaterThanTupleNodeType |
            typeof ZenithScanCriteria.GreaterThanOrEqualTupleNodeType |
            typeof ZenithScanCriteria.LessThanTupleNodeType |
            typeof ZenithScanCriteria.LessThanOrEqualTupleNodeType,
        node: ScanCriteria.NumericComparisonBooleanNode
    ): ZenithScanCriteria.ComparisonTupleNode {
        const leftOperand = fromNumericOperand(node.leftOperand);
        const rightOperand = fromNumericOperand(node.leftOperand);
        return [type, leftOperand, rightOperand];
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
            case ScanCriteria.NodeTypeId.NumericAdd: return fromLeftRightArithmeticNumericNodeParam(ZenithScanCriteria.AddTupleNodeType, node as ScanCriteria.LeftRightArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericDiv: return fromLeftRightArithmeticNumericNodeParam(ZenithScanCriteria.DivTupleNodeType, node as ScanCriteria.LeftRightArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericMod: return fromLeftRightArithmeticNumericNodeParam(ZenithScanCriteria.ModTupleNodeType, node as ScanCriteria.LeftRightArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericMul: return fromLeftRightArithmeticNumericNodeParam(ZenithScanCriteria.MulTupleNodeType, node as ScanCriteria.LeftRightArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericSub: return fromLeftRightArithmeticNumericNodeParam(ZenithScanCriteria.SubTupleNodeType, node as ScanCriteria.LeftRightArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericNeg: return fromUnaryArithmeticNumericNodeParam(ZenithScanCriteria.NegTupleNodeType, node as ScanCriteria.UnaryArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericPos: return fromUnaryArithmeticNumericNodeParam(ZenithScanCriteria.PosTupleNodeType, node as ScanCriteria.UnaryArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericAbs: return fromUnaryArithmeticNumericNodeParam(ZenithScanCriteria.AbsTupleNodeType, node as ScanCriteria.UnaryArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericFieldValueGet: return fromNumericFieldValueGetNode(node as ScanCriteria.NumericFieldValueGetNode);
            default:
                throw new UnreachableCaseError('ZSCCFNNPU', node.typeId);
        }
    }

    function fromUnaryArithmeticNumericNodeParam(
        type:
            typeof ZenithScanCriteria.NegTupleNodeType |
            typeof ZenithScanCriteria.PosTupleNodeType |
            typeof ZenithScanCriteria.AbsTupleNodeType,
        node: ScanCriteria.UnaryArithmeticNumericNode
    ): ZenithScanCriteria.UnaryExpressionTupleNode {
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
        type:
            typeof ZenithScanCriteria.AddTupleNodeType |
            typeof ZenithScanCriteria.DivTupleNodeType |
            typeof ZenithScanCriteria.ModTupleNodeType |
            typeof ZenithScanCriteria.MulTupleNodeType |
            typeof ZenithScanCriteria.SubTupleNodeType,
        node: ScanCriteria.LeftRightArithmeticNumericNode
    ): ZenithScanCriteria.BinaryExpressionTupleNode {
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

    function fromNumericFieldValueGetNode(node: ScanCriteria.NumericFieldValueGetNode): ZenithScanCriteria.NumericField {
        return Field.numericFromId(node.fieldId);
    }

    function fromBooleanFieldEqualsNode(node: ScanCriteria.BooleanFieldEqualsNode): ZenithScanCriteria.BooleanSingleMatchingTupleNode {
        const field = Field.booleanFromId(node.fieldId);
        const target = node.target;
        return [field, target];
    }

    function fromNumericFieldHasValueNode(node: ScanCriteria.NumericFieldHasValueNode): ZenithScanCriteria.NumericRangeParams_FirstForm {
        const field = Field.numericFromId(node.fieldId);
        return [field];
    }

    function fromNumericFieldEqualsNode(node: ScanCriteria.NumericFieldEqualsNode): ZenithScanCriteria.NumericRangeParams_SecondForm {
        const field = Field.numericFromId(node.fieldId);
        const target = node.target;
        return [field, target];
    }

    function fromNumericFieldInRangeNode(node: ScanCriteria.NumericFieldInRangeNode): ZenithScanCriteria.NumericRangeParams_FourthForm {
        const field = Field.numericFromId(node.fieldId);
        const namedParameters: ZenithScanCriteria.NumericNamedParameters = {
            Min: node.min,
            Max: node.max,
        }
        return [field, namedParameters];
    }

    function fromDateFieldHasValueNode(node: ScanCriteria.DateFieldHasValueNode): ZenithScanCriteria.DateRangeParams_FirstForm {
        const field = Field.dateFromId(node.fieldId);
        return [field];
    }

    function fromDateFieldEqualsNode(node: ScanCriteria.DateFieldEqualsNode): ZenithScanCriteria.DateRangeParams_SecondForm {
        const field = Field.dateFromId(node.fieldId);
        const target = DateValue.fromDate(node.target);
        return [field, target];
    }

    function fromDateFieldInRangeNode(node: ScanCriteria.DateFieldInRangeNode): ZenithScanCriteria.DateRangeParams_FourthForm {
        const field = Field.dateFromId(node.fieldId);
        const nodeMin = node.min;
        const nodeMax = node.max;
        const namedParameters: ZenithScanCriteria.DateNamedParameters = {
            Min: nodeMin === undefined ? undefined: DateValue.fromDate(nodeMin),
            Max: nodeMax === undefined ? undefined: DateValue.fromDate(nodeMax),
        }
        return [field, namedParameters];
    }

    function fromTextFieldHasValueNode(node: ScanCriteria.TextFieldHasValueNode): ZenithScanCriteria.TextParams_FirstForm {
        const field = Field.textFromId(node.fieldId);
        return [field];
    }

    function fromTextFieldContainsNode(node: ScanCriteria.TextFieldContainsNode): ZenithScanCriteria.TextParams_FourthForm {
        const field = Field.textFromId(node.fieldId);
        const value = node.value;
        const as = TextContainsAs.fromId(node.as);
        const namedParameters: ZenithScanCriteria.TextNamedParameters = {
            As: as,
            IgnoreCase: node.ignoreCase,
        }
        return [field, value, namedParameters];
    }

    function fromPriceSubHasValueNode(node: ScanCriteria.PriceSubFieldHasValueNode): ZenithScanCriteria.NumericNamedRangeParams_FirstForm {
        const field = ZenithScanCriteria.PriceTupleNodeType;
        const subField = PriceSubField.fromId(node.subFieldId);
        return [field, subField];
    }

    function fromPriceSubFieldEqualsNode(node: ScanCriteria.PriceSubFieldEqualsNode): ZenithScanCriteria.NumericNamedRangeParams_SecondForm {
        const field = ZenithScanCriteria.PriceTupleNodeType;
        const subField = PriceSubField.fromId(node.subFieldId);
        const target = node.target;
        return [field, subField, target];
    }

    function fromPriceSubFieldInRangeNode(node: ScanCriteria.PriceSubFieldInRangeNode): ZenithScanCriteria.NumericNamedRangeParams_FourthForm {
        const field = ZenithScanCriteria.PriceTupleNodeType;
        const subField = PriceSubField.fromId(node.subFieldId);
        const namedParameters: ZenithScanCriteria.NumericNamedParameters = {
            Min: node.min,
            Max: node.max,
        }
        return [field, subField, namedParameters];
    }

    function fromDateSubFieldHasValueNode(node: ScanCriteria.DateSubFieldHasValueNode): ZenithScanCriteria.DateNamedRangeParams_FirstForm {
        const field = ZenithScanCriteria.DateTupleNodeType;
        const subField = DateSubField.fromId(node.subFieldId);
        return [field, subField];
    }

    function fromDateSubFieldEqualsNode(node: ScanCriteria.DateSubFieldEqualsNode): ZenithScanCriteria.DateNamedRangeParams_SecondForm {
        const field = ZenithScanCriteria.DateTupleNodeType;
        const subField = DateSubField.fromId(node.subFieldId);
        const target = DateValue.fromDate(node.target);
        return [field, subField, target];
    }

    function fromDateSubFieldInRangeNode(node: ScanCriteria.DateSubFieldInRangeNode): ZenithScanCriteria.DateNamedRangeParams_FourthForm {
        const field = ZenithScanCriteria.DateTupleNodeType;
        const subField = DateSubField.fromId(node.subFieldId);
        const nodeMin = node.min;
        const nodeMax = node.max;
        const namedParameters: ZenithScanCriteria.DateNamedParameters = {
            Min: nodeMin === undefined ? undefined: DateValue.fromDate(nodeMin),
            Max: nodeMax === undefined ? undefined: DateValue.fromDate(nodeMax),
        }
        return [field, subField, namedParameters];
    }

    function fromAltCodeSubFieldHasValueNode(node: ScanCriteria.AltCodeSubFieldHasValueNode): ZenithScanCriteria.NamedTextParams_FirstForm {
        const field = ZenithScanCriteria.AltCodeTupleNodeType;
        const subField = AltCodeSubField.fromId(node.subFieldId);
        return [field, subField];
    }

    function fromAltCodeSubFieldContainsNode(node: ScanCriteria.AltCodeSubFieldContainsNode): ZenithScanCriteria.NamedTextParams_FourthForm {
        const field = ZenithScanCriteria.AltCodeTupleNodeType;
        const subField = AltCodeSubField.fromId(node.subFieldId);
        const value = node.value;
        const as = TextContainsAs.fromId(node.as);
        const namedParameters: ZenithScanCriteria.TextNamedParameters = {
            As: as,
            IgnoreCase: node.ignoreCase,
        }
        return [field, subField, value, namedParameters];
    }

    function fromAttributeSubFieldHasValueNode(node: ScanCriteria.AttributeSubFieldHasValueNode): ZenithScanCriteria.NamedTextParams_FirstForm {
        const field = ZenithScanCriteria.AttributeTupleNodeType;
        const subField = AttributeSubField.fromId(node.subFieldId);
        return [field, subField];
    }

    function fromAttributeSubFieldContainsNode(node: ScanCriteria.AttributeSubFieldContainsNode): ZenithScanCriteria.NamedTextParams_FourthForm {
        const field = ZenithScanCriteria.AttributeTupleNodeType;
        const subField = AttributeSubField.fromId(node.subFieldId);
        const value = node.value;
        const as = TextContainsAs.fromId(node.as);
        const namedParameters: ZenithScanCriteria.TextNamedParameters = {
            As: as,
            IgnoreCase: node.ignoreCase,
        }
        return [field, subField, value, namedParameters];
    }

    function tryToExpectedBooleanNode(node: ZenithScanCriteria.BooleanTupleNode, toProgress: ParseProgress): Result<ScanCriteria.BooleanNode, ZenithScanCriteriaParseError> {
        toProgress.enterTupleNode();
        if (!Array.isArray(node)) {
            return new Err(new ZenithScanCriteriaParseError(ExternalError.Code.ZenithScanCriteriaParse_BooleanNodeIsNotAnArray, ''))
        } else {
            if (node.length === 0) {
                return new Err(new ZenithScanCriteriaParseError(ExternalError.Code.ZenithScanCriteriaParse_BooleanNodeArrayIsZeroLength, ''))
            } else {
                const nodeType = node[0];
                if (typeof nodeType !== 'string') {
                    return new Err(new ZenithScanCriteriaParseError(ExternalError.Code.ZenithScanCriteriaParse_BooleanNodeTypeIsNotString, `${nodeType}`));
                } else {
                    const parsedNode = toProgress.addParsedNode(nodeType);

                    const result = tryToBooleanNode(node, toProgress)

                    if (result.isOk()) {
                        toProgress.exitTupleNode(parsedNode, result.value.typeId);
                    }

                    return result;
                }
            }
        }
    }

    function tryToBooleanNode(node: ZenithScanCriteria.BooleanTupleNode, toProgress: ParseProgress): Result<ScanCriteria.BooleanNode, ZenithScanCriteriaParseError> {
        switch (node[0]) {
            // Logical
            case ZenithScanCriteria.AndTupleNodeType: return tryToMultiOperandLogicalBooleanNode(node as ZenithScanCriteria.LogicalTupleNode, ScanCriteria.AndNode, toProgress);
            case ZenithScanCriteria.OrTupleNodeType: return tryToMultiOperandLogicalBooleanNode(node as ZenithScanCriteria.LogicalTupleNode, ScanCriteria.OrNode, toProgress);
            case ZenithScanCriteria.NotTupleNodeType: return tryToSingleOperandLogicalBooleanNode(node as ZenithScanCriteria.LogicalTupleNode, ScanCriteria.NotNode, toProgress);

            // Comparison
            case ZenithScanCriteria.EqualTupleNodeType: return tryToNumericComparisonNode(node as ZenithScanCriteria.ComparisonTupleNode, ScanCriteria.NumericEqualsNode, toProgress);
            case ZenithScanCriteria.GreaterThanTupleNodeType: return tryToNumericComparisonNode(node as ZenithScanCriteria.ComparisonTupleNode, ScanCriteria.NumericGreaterThanNode, toProgress);
            case ZenithScanCriteria.GreaterThanOrEqualTupleNodeType: return tryToNumericComparisonNode(node as ZenithScanCriteria.ComparisonTupleNode, ScanCriteria.NumericGreaterThanOrEqualNode, toProgress);
            case ZenithScanCriteria.LessThanTupleNodeType: return tryToNumericComparisonNode(node as ZenithScanCriteria.ComparisonTupleNode, ScanCriteria.NumericLessThanNode, toProgress);
            case ZenithScanCriteria.LessThanOrEqualTupleNodeType: return tryToNumericComparisonNode(node as ZenithScanCriteria.ComparisonTupleNode, ScanCriteria.NumericLessThanOrEqualNode, toProgress);
            case ZenithScanCriteria.AllTupleNodeType: return new Ok(new ScanCriteria.AllNode());
            case ZenithScanCriteria.NoneTupleNodeType: return new Ok(new ScanCriteria.NoneNode());

            // Matching
            case ZenithScanCriteria.AltCodeTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.AttributeTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.AuctionTupleNodeType: return tryToFieldBooleanNode(node as ZenithScanCriteria.MatchingTupleNode, ScanCriteria.FieldId.Auction, toProgress);
            case ZenithScanCriteria.AuctionLastTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.AuctionQuantityTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.BestAskCountTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.BestAskPriceTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.BestAskQuantityTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.BestBidCountTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.BestBidPriceTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.BestBidQuantityTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.BoardTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.CallOrPutTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.CategoryTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.CfiTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.ClassTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.ClosePriceTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.CodeTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.ContractSizeTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.CurrencyTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.DataTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.DateTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.ExerciseTypeTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.ExchangeTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.ExpiryDateTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.HighPriceTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.IsIndexTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.LegTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.LastPriceTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.LotSizeTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.LowPriceTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.MarketTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.NameTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.OpenInterestTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.OpenPriceTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.PriceTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.PreviousCloseTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.QuotationBasisTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.RemainderTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.ShareIssueTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.StateTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.StateAllowsTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.StatusNoteTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.StrikePriceTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.TradesTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.TradingMarketTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.ValueTradedTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.VolumeTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.VwapTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);

            // Binary
            case ZenithScanCriteria.AddTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.DivSymbolTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.DivTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.ModSymbolTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.ModTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.MulSymbolTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.MulTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.SubTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);

            // Unary
            case ZenithScanCriteria.NegTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.PosTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.AbsTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);

            // Unary or Binary (depending on number of params)
            case ZenithScanCriteria.SubOrNegSymbolTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
            case ZenithScanCriteria.AddOrPosSymbolTupleNodeType: return tryToNode(node as ZenithScanCriteria.Node);
        }
    }

    function tryToMultiOperandLogicalBooleanNode(
        tulipNode: ZenithScanCriteria.LogicalTupleNode,
        nodeConstructor: new() => ScanCriteria.MultiOperandBooleanNode,
        toProgress: ParseProgress,
    ): Result<ScanCriteria.MultiOperandBooleanNode, ZenithScanCriteriaParseError> {
        const tulipNodeLength = tulipNode.length;
        if (tulipNodeLength < 2) {
            return new Err(new ZenithScanCriteriaParseError(ExternalError.Code.ZenithScanCriteriaParse_LogicalBooleanMissingOperands, tulipNode[0]))
        } else {
            const operands = new Array<ScanCriteria.BooleanNode>(tulipNodeLength - 1);
            for (let i = 1; i < tulipNodeLength; i++) {
                const tulipParam = tulipNode[i];
                const operandResult = tryToExpectedBooleanOperand(tulipParam, toProgress);
                if (operandResult.isErr()) {
                    return operandResult;
                } else {
                    operands[i - 1] = operandResult.value;
                }
            }

            const resultNode = new nodeConstructor();
            resultNode.operands = operands;
            return new Ok(resultNode);
        }
    }

    function tryToSingleOperandLogicalBooleanNode(
        tulipNode: ZenithScanCriteria.LogicalTupleNode,
        nodeConstructor: new() => ScanCriteria.SingleOperandBooleanNode,
        toProgress: ParseProgress,
    ): Result<ScanCriteria.SingleOperandBooleanNode, ZenithScanCriteriaParseError> {
        if (tulipNode.length !== 2) {
            return new Err(new ZenithScanCriteriaParseError(ExternalError.Code.ZenithScanCriteriaParse_LogicalBooleanMissingOperand, tulipNode[0]))
        } else {
            const tupleNodeResult = tryToExpectedBooleanOperand(tulipNode[1], toProgress);
            if (tupleNodeResult.isErr()) {
                return tupleNodeResult;
            } else {
                const resultNode = new nodeConstructor();
                resultNode.operand = tupleNodeResult.value;
                return new Ok(resultNode);
            }
        }
    }

    function tryToExpectedBooleanOperand(
        param: ZenithScanCriteria.BooleanParam,
        toProgress: ParseProgress
    ): Result<ScanCriteria.BooleanNode, ZenithScanCriteriaParseError> {
        if (Array.isArray(param)) {
            return tryToExpectedBooleanNode(param, toProgress);
        } else {
            if (typeof param !== 'string') {
                return new Err(new ZenithScanCriteriaParseError(ExternalError.Code.ZenithScanCriteriaParse_UnexpectedBooleanParamType, `${param}`));
            } else {
                const fieldId = Field.tryMatchingToId(param);
                if (fieldId === undefined) {
                    return new Err(new ZenithScanCriteriaParseError(ExternalError.Code.ZenithScanCriteriaParse_UnknownFieldBooleanParam, `${param}`));
                } else {
                    return toFieldHasValueNode(fieldId);
                }
            }
        }
    }

    // function tryToFieldBooleanNode(value: ZenithScanCriteria.MatchingField): Result<ScanCriteria.FieldBooleanNode, ZenithScanCriteriaParseError> {
    //     switch (value) {

    //     }
    // }

    function tryToFieldBooleanNode(
        node: ZenithScanCriteria.MatchingTupleNode,
        fieldId: ScanCriteria.FieldId,
        toProgress: ParseProgress
    ): Result<ScanCriteria.FieldBooleanNode, ZenithScanCriteriaParseError> {
        const paramCount = node.length - 1;
        switch (paramCount) {
            case 0: return toFieldHasValueNode(fieldId);
            case 1: {

            }
        }
    }

    function toFieldHasValueNode(fieldId: ScanCriteria.FieldId): Result<ScanCriteria.NumericFieldHasValueNode | ScanCriteria.DateFieldHasValueNode | ScanCriteria.TextFieldHasValueNode, never> {
        const hasValueNode = createFieldHasValueNode(fieldId);
        return new Ok(hasValueNode);
    }

    function createFieldHasValueNode(fieldId: ScanCriteria.FieldId): ScanCriteria.NumericFieldHasValueNode | ScanCriteria.DateFieldHasValueNode | ScanCriteria.TextFieldHasValueNode {
        const fieldDataTypeId = ScanCriteria.Field.idToDataTypeId(fieldId);
        switch (fieldDataTypeId) {
            case ScanCriteria.FieldDataTypeId.Numeric: return new ScanCriteria.NumericFieldHasValueNode();
            case ScanCriteria.FieldDataTypeId.Date: return new ScanCriteria.DateFieldHasValueNode();
            case ScanCriteria.FieldDataTypeId.Text: return new ScanCriteria.TextFieldHasValueNode();
            case ScanCriteria.FieldDataTypeId.Boolean: throw new AssertInternalError('ZSCCCFHVNB30091', `${fieldId}`); // return new ScanCriteria.BooleanFieldHasValueNode();
            default:
                throw new UnreachableCaseError('ZSCCCFHVND30091', fieldDataTypeId);
        }
    }

    function tryToNumericComparisonNode(
        tulipNode: ZenithScanCriteria.ComparisonTupleNode,
        nodeConstructor: new() => ScanCriteria.NumericComparisonBooleanNode,
        toProgress: ParseProgress,
    ): Result<ScanCriteria.NumericComparisonBooleanNode, ZenithScanCriteriaParseError> {
        const nodeType = tulipNode[0];
        if (tulipNode.length !== 3) {
            return new Err(new ZenithScanCriteriaParseError(ExternalError.Code.ZenithScanCriteriaParse_NumericComparisonDoesNotHave2Operands, nodeType))
        } else {
            const leftParam = tulipNode[1] as ZenithScanCriteria.NumericParam;
            const leftOperandResult = tryToExpectedNumericOperand(leftParam, `${nodeType}/${Strings[StringId.Left]}`, toProgress);
            if (leftOperandResult.isErr()) {
                return leftOperandResult;
            } else {
                const rightParam = tulipNode[2] as ZenithScanCriteria.NumericParam;
                const rightOperandResult = tryToExpectedNumericOperand(rightParam, `${nodeType}/${Strings[StringId.Right]}`, toProgress);
                if (rightOperandResult.isErr()) {
                    return rightOperandResult;
                } else {
                    const resultNode = new nodeConstructor();
                    resultNode.leftOperand = leftOperandResult.value;
                    resultNode.rightOperand = rightOperandResult.value;
                    return new Ok(resultNode);
                }
            }
        }
    }

    function tryToExpectedNumericOperand(
        param: ZenithScanCriteria.NumericParam,
        paramId: string,
        toProgress: ParseProgress,
    ): Result<ScanCriteria.NumericNode | number, ZenithScanCriteriaParseError> {
        const paramType = typeof param;
        if (typeof param === 'number') {
            return new Ok(param);
        } else {
            if (typeof param === 'string') {
                return tryToExpectedNumericFieldValueGet(param, toProgress);
            } else {
                if (!Array.isArray(param)) {
                    return new Err(new ZenithScanCriteriaParseError(ExternalError.Code.ZenithScanCriteriaParse_NumericParameterIsNotNumberOrComparableFieldOrArray, paramId));
                } else {
                    if
                    return new Ok(param);
                }
            }

        }
        switch (paramType) {
            case 'number':
        }
        if (operand instanceof ScanCriteria.NumericNode) {
            return fromNumericNodeParam(operand)
        } else {
            return operand;
        }
    }

    function fromNumericNodeParam(node: ScanCriteria.NumericNode): ZenithScanCriteria.NumericParam {
        switch (node.typeId) {
            case ScanCriteria.NodeTypeId.NumericAdd: return fromLeftRightArithmeticNumericNodeParam(ZenithScanCriteria.AddTupleNodeType, node as ScanCriteria.LeftRightArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericDiv: return fromLeftRightArithmeticNumericNodeParam(ZenithScanCriteria.DivTupleNodeType, node as ScanCriteria.LeftRightArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericMod: return fromLeftRightArithmeticNumericNodeParam(ZenithScanCriteria.ModTupleNodeType, node as ScanCriteria.LeftRightArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericMul: return fromLeftRightArithmeticNumericNodeParam(ZenithScanCriteria.MulTupleNodeType, node as ScanCriteria.LeftRightArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericSub: return fromLeftRightArithmeticNumericNodeParam(ZenithScanCriteria.SubTupleNodeType, node as ScanCriteria.LeftRightArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericNeg: return fromUnaryArithmeticNumericNodeParam(ZenithScanCriteria.NegTupleNodeType, node as ScanCriteria.UnaryArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericPos: return fromUnaryArithmeticNumericNodeParam(ZenithScanCriteria.PosTupleNodeType, node as ScanCriteria.UnaryArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericAbs: return fromUnaryArithmeticNumericNodeParam(ZenithScanCriteria.AbsTupleNodeType, node as ScanCriteria.UnaryArithmeticNumericNode);
            case ScanCriteria.NodeTypeId.NumericFieldValueGet: return fromNumericFieldValueGetNode(node as ScanCriteria.NumericFieldValueGetNode);
            default:
                throw new UnreachableCaseError('ZSCCFNNPU', node.typeId);
        }
    }

    function fromUnaryArithmeticNumericNodeParam(
        type:
            typeof ZenithScanCriteria.NegTupleNodeType |
            typeof ZenithScanCriteria.PosTupleNodeType |
            typeof ZenithScanCriteria.AbsTupleNodeType,
        node: ScanCriteria.UnaryArithmeticNumericNode
    ): ZenithScanCriteria.UnaryExpressionTupleNode {
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
        type:
            typeof ZenithScanCriteria.AddTupleNodeType |
            typeof ZenithScanCriteria.DivTupleNodeType |
            typeof ZenithScanCriteria.ModTupleNodeType |
            typeof ZenithScanCriteria.MulTupleNodeType |
            typeof ZenithScanCriteria.SubTupleNodeType,
        node: ScanCriteria.LeftRightArithmeticNumericNode
    ): ZenithScanCriteria.BinaryExpressionTupleNode {
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

    function fromNumericFieldValueGetNode(node: ScanCriteria.NumericFieldValueGetNode): ZenithScanCriteria.NumericField {
        return Field.numericFromId(node.fieldId);
    }

    function fromBooleanFieldEqualsNode(node: ScanCriteria.BooleanFieldEqualsNode): ZenithScanCriteria.MatchingTupleNode {
        const field = Field.booleanFromId(node.fieldId);
        const target = node.target;
        return [field, target];
    }

    function fromNumericFieldHasValueNode(node: ScanCriteria.NumericFieldHasValueNode): ZenithScanCriteria.MatchingTupleNode {
        const field = Field.numericFromId(node.fieldId);
        return [field];
    }

    function fromNumericFieldEqualsNode(node: ScanCriteria.NumericFieldEqualsNode): ZenithScanCriteria.MatchingTupleNode {
        const field = Field.numericFromId(node.fieldId);
        const target = node.target;
        return [field, target];
    }

    function fromNumericFieldInRangeNode(node: ScanCriteria.NumericFieldInRangeNode): ZenithScanCriteria.MatchingTupleNode {
        const field = Field.numericFromId(node.fieldId);
        const namedParameters: ZenithScanCriteria.NumericNamedParameters = {
            Min: node.min,
            Max: node.max,
        }
        return [field, namedParameters];
    }

    function fromDateFieldHasValueNode(node: ScanCriteria.DateFieldHasValueNode): ZenithScanCriteria.MatchingTupleNode {
        const field = Field.dateFromId(node.fieldId);
        return [field];
    }

    function fromDateFieldEqualsNode(node: ScanCriteria.DateFieldEqualsNode): ZenithScanCriteria.MatchingTupleNode {
        const field = Field.dateFromId(node.fieldId);
        const target = DateValue.fromDate(node.target);
        return [field, target];
    }

    function fromDateFieldInRangeNode(node: ScanCriteria.DateFieldInRangeNode): ZenithScanCriteria.MatchingTupleNode {
        const field = Field.dateFromId(node.fieldId);
        const nodeMin = node.min;
        const nodeMax = node.max;
        const namedParameters: ZenithScanCriteria.DateNamedParameters = {
            Min: nodeMin === undefined ? undefined: DateValue.fromDate(nodeMin),
            Max: nodeMax === undefined ? undefined: DateValue.fromDate(nodeMax),
        }
        return [field, namedParameters];
    }

    function fromTextFieldHasValueNode(node: ScanCriteria.TextFieldHasValueNode): ZenithScanCriteria.MatchingTupleNode {
        const field = Field.textFromId(node.fieldId);
        return [field];
    }

    function fromTextFieldContainsNode(node: ScanCriteria.TextFieldContainsNode): ZenithScanCriteria.MatchingTupleNode {
        const field = Field.textFromId(node.fieldId);
        const value = node.value;
        const as = TextContainsAs.fromId(node.as);
        const namedParameters: ZenithScanCriteria.TextNamedParameters = {
            As: as,
            IgnoreCase: node.ignoreCase,
        }
        return [field, value, namedParameters];
    }

    function fromPriceSubHasValueNode(node: ScanCriteria.PriceSubFieldHasValueNode): ZenithScanCriteria.MatchingTupleNode {
        const field = ZenithScanCriteria.PriceTupleNodeType;
        const subField = PriceSubField.fromId(node.subFieldId);
        return [field, subField];
    }

    function fromPriceSubFieldEqualsNode(node: ScanCriteria.PriceSubFieldEqualsNode): ZenithScanCriteria.MatchingTupleNode {
        const field = ZenithScanCriteria.PriceTupleNodeType;
        const subField = PriceSubField.fromId(node.subFieldId);
        const target = node.target;
        return [field, subField, target];
    }

    function fromPriceSubFieldInRangeNode(node: ScanCriteria.PriceSubFieldInRangeNode): ZenithScanCriteria.MatchingTupleNode {
        const field = ZenithScanCriteria.PriceTupleNodeType;
        const subField = PriceSubField.fromId(node.subFieldId);
        const namedParameters: ZenithScanCriteria.NumericNamedParameters = {
            Min: node.min,
            Max: node.max,
        }
        return [field, subField, namedParameters];
    }

    function fromDateSubFieldHasValueNode(node: ScanCriteria.DateSubFieldHasValueNode): ZenithScanCriteria.MatchingTupleNode {
        const field = ZenithScanCriteria.DateTupleNodeType;
        const subField = DateSubField.fromId(node.subFieldId);
        return [field, subField];
    }

    function fromDateSubFieldEqualsNode(node: ScanCriteria.DateSubFieldEqualsNode): ZenithScanCriteria.MatchingTupleNode {
        const field = ZenithScanCriteria.DateTupleNodeType;
        const subField = DateSubField.fromId(node.subFieldId);
        const target = DateValue.fromDate(node.target);
        return [field, subField, target];
    }

    function fromDateSubFieldInRangeNode(node: ScanCriteria.DateSubFieldInRangeNode): ZenithScanCriteria.MatchingTupleNode {
        const field = ZenithScanCriteria.DateTupleNodeType;
        const subField = DateSubField.fromId(node.subFieldId);
        const nodeMin = node.min;
        const nodeMax = node.max;
        const namedParameters: ZenithScanCriteria.DateNamedParameters = {
            Min: nodeMin === undefined ? undefined: DateValue.fromDate(nodeMin),
            Max: nodeMax === undefined ? undefined: DateValue.fromDate(nodeMax),
        }
        return [field, subField, namedParameters];
    }

    function fromAltCodeSubFieldHasValueNode(node: ScanCriteria.AltCodeSubFieldHasValueNode): ZenithScanCriteria.MatchingTupleNode {
        const field = ZenithScanCriteria.AltCodeTupleNodeType;
        const subField = AltCodeSubField.fromId(node.subFieldId);
        return [field, subField];
    }

    function fromAltCodeSubFieldContainsNode(node: ScanCriteria.AltCodeSubFieldContainsNode): ZenithScanCriteria.MatchingTupleNode {
        const field = ZenithScanCriteria.AltCodeTupleNodeType;
        const subField = AltCodeSubField.fromId(node.subFieldId);
        const as = TextContainsAs.fromId(node.as);
        const namedParameters: ZenithScanCriteria.TextNamedParameters = {
            As: as,
            IgnoreCase: node.ignoreCase,
        }
        return [field, subField, namedParameters];
    }

    function fromAttributeSubFieldHasValueNode(node: ScanCriteria.AttributeSubFieldHasValueNode): ZenithScanCriteria.MatchingTupleNode {
        const field = ZenithScanCriteria.AttributeTupleNodeType;
        const subField = AttributeSubField.fromId(node.subFieldId);
        return [field, subField];
    }

    function fromAttributeSubFieldContainsNode(node: ScanCriteria.AttributeSubFieldContainsNode): ZenithScanCriteria.MatchingTupleNode {
        const field = ZenithScanCriteria.AttributeTupleNodeType;
        const subField = AttributeSubField.fromId(node.subFieldId);
        const as = TextContainsAs.fromId(node.as);
        const namedParameters: ZenithScanCriteria.TextNamedParameters = {
            As: as,
            IgnoreCase: node.ignoreCase,
        }
        return [field, subField, namedParameters];
    }


    namespace Field {
        export function tryMatchingToId(value: ZenithScanCriteria.MatchingField): ScanCriteria.FieldId | undefined {
            let fieldId: ScanCriteria.FieldId | undefined = tryNumericToId(value);
            if (fieldId === undefined) {
                fieldId = tryTextToId(value);
                if (fieldId === undefined) {
                    fieldId = tryDateToId(value);
                    if (fieldId === undefined) {
                        fieldId = tryBooleanToId(value);
                    }
                }
            }

            return fieldId;
        }

        export function tryDateToId(value: ZenithScanCriteria.MatchingField): ScanCriteria.DateFieldId | undefined {
            switch (value) {
                case ZenithScanCriteria.ExpiryDateTupleNodeType: return ScanCriteria.FieldId.ExpiryDate;
                default: return undefined;
            }
        }

        export function dateFromId(value: ScanCriteria.DateFieldId): ZenithScanCriteria.MatchingField {
            switch (value) {
                case ScanCriteria.FieldId.ExpiryDate: return ZenithScanCriteria.ExpiryDateTupleNodeType;
                default:
                    throw new UnexpectedCaseError('ZSCCDFFI16179', `${value}`);
            }
        }

        export function tryNumericToId(value: ZenithScanCriteria.MatchingField): ScanCriteria.NumericFieldId | undefined {
            switch (value) {
                case ZenithScanCriteria.AuctionTupleNodeType: return ScanCriteria.FieldId.Auction;
                case ZenithScanCriteria.AuctionLastTupleNodeType: return ScanCriteria.FieldId.AuctionLast;
                case ZenithScanCriteria.AuctionQuantityTupleNodeType: return ScanCriteria.FieldId.AuctionQuantity;
                case ZenithScanCriteria.BestAskCountTupleNodeType: return ScanCriteria.FieldId.BestAskCount;
                case ZenithScanCriteria.BestAskPriceTupleNodeType: return ScanCriteria.FieldId.BestAskPrice;
                case ZenithScanCriteria.BestAskQuantityTupleNodeType: return ScanCriteria.FieldId.BestAskQuantity;
                case ZenithScanCriteria.BestBidCountTupleNodeType: return ScanCriteria.FieldId.BestBidCount;
                case ZenithScanCriteria.BestBidPriceTupleNodeType: return ScanCriteria.FieldId.BestBidPrice;
                case ZenithScanCriteria.BestBidQuantityTupleNodeType: return ScanCriteria.FieldId.BestBidQuantity;
                case ZenithScanCriteria.ClosePriceTupleNodeType: return ScanCriteria.FieldId.ClosePrice;
                case ZenithScanCriteria.ContractSizeTupleNodeType: return ScanCriteria.FieldId.ContractSize;
                case ZenithScanCriteria.HighPriceTupleNodeType: return ScanCriteria.FieldId.HighPrice;
                case ZenithScanCriteria.LastPriceTupleNodeType: return ScanCriteria.FieldId.LastPrice;
                case ZenithScanCriteria.LotSizeTupleNodeType: return ScanCriteria.FieldId.LotSize;
                case ZenithScanCriteria.LowPriceTupleNodeType: return ScanCriteria.FieldId.LowPrice;
                case ZenithScanCriteria.OpenInterestTupleNodeType: return ScanCriteria.FieldId.OpenInterest;
                case ZenithScanCriteria.OpenPriceTupleNodeType: return ScanCriteria.FieldId.OpenPrice;
                case ZenithScanCriteria.PreviousCloseTupleNodeType: return ScanCriteria.FieldId.PreviousClose;
                case ZenithScanCriteria.RemainderTupleNodeType: return ScanCriteria.FieldId.Remainder;
                case ZenithScanCriteria.ShareIssueTupleNodeType: return ScanCriteria.FieldId.ShareIssue;
                case ZenithScanCriteria.StrikePriceTupleNodeType: return ScanCriteria.FieldId.StrikePrice;
                case ZenithScanCriteria.TradesTupleNodeType: return ScanCriteria.FieldId.Trades;
                case ZenithScanCriteria.ValueTradedTupleNodeType: return ScanCriteria.FieldId.ValueTraded;
                case ZenithScanCriteria.VolumeTupleNodeType: return ScanCriteria.FieldId.Volume;
                case ZenithScanCriteria.VwapTupleNodeType: return ScanCriteria.FieldId.Vwap;
                default: return undefined;
            }
        }

        export function numericFromId(value: ScanCriteria.NumericFieldId): ZenithScanCriteria.MatchingField {
            switch (value) {
                case ScanCriteria.FieldId.Auction: return ZenithScanCriteria.AuctionTupleNodeType;
                case ScanCriteria.FieldId.AuctionLast: return ZenithScanCriteria.AuctionLastTupleNodeType;
                case ScanCriteria.FieldId.AuctionQuantity: return ZenithScanCriteria.AuctionQuantityTupleNodeType;
                case ScanCriteria.FieldId.BestAskCount: return ZenithScanCriteria.BestAskCountTupleNodeType;
                case ScanCriteria.FieldId.BestAskPrice: return ZenithScanCriteria.BestAskPriceTupleNodeType;
                case ScanCriteria.FieldId.BestAskQuantity: return ZenithScanCriteria.BestAskQuantityTupleNodeType;
                case ScanCriteria.FieldId.BestBidCount: return ZenithScanCriteria.BestBidCountTupleNodeType;
                case ScanCriteria.FieldId.BestBidPrice: return ZenithScanCriteria.BestBidPriceTupleNodeType;
                case ScanCriteria.FieldId.BestBidQuantity: return ZenithScanCriteria.BestBidQuantityTupleNodeType;
                case ScanCriteria.FieldId.ClosePrice: return ZenithScanCriteria.ClosePriceTupleNodeType;
                case ScanCriteria.FieldId.ContractSize: return ZenithScanCriteria.ContractSizeTupleNodeType;
                case ScanCriteria.FieldId.HighPrice: return ZenithScanCriteria.HighPriceTupleNodeType;
                case ScanCriteria.FieldId.LastPrice: return ZenithScanCriteria.LastPriceTupleNodeType;
                case ScanCriteria.FieldId.LotSize: return ZenithScanCriteria.LotSizeTupleNodeType;
                case ScanCriteria.FieldId.LowPrice: return ZenithScanCriteria.LowPriceTupleNodeType;
                case ScanCriteria.FieldId.OpenInterest: return ZenithScanCriteria.OpenInterestTupleNodeType;
                case ScanCriteria.FieldId.OpenPrice: return ZenithScanCriteria.OpenPriceTupleNodeType;
                case ScanCriteria.FieldId.PreviousClose: return ZenithScanCriteria.PreviousCloseTupleNodeType;
                case ScanCriteria.FieldId.Remainder: return ZenithScanCriteria.RemainderTupleNodeType;
                case ScanCriteria.FieldId.ShareIssue: return ZenithScanCriteria.ShareIssueTupleNodeType;
                case ScanCriteria.FieldId.StrikePrice: return ZenithScanCriteria.StrikePriceTupleNodeType;
                case ScanCriteria.FieldId.Trades: return ZenithScanCriteria.TradesTupleNodeType;
                case ScanCriteria.FieldId.ValueTraded: return ZenithScanCriteria.ValueTradedTupleNodeType;
                case ScanCriteria.FieldId.Volume: return ZenithScanCriteria.VolumeTupleNodeType;
                case ScanCriteria.FieldId.Vwap: return ZenithScanCriteria.VwapTupleNodeType;
                default:
                    throw new UnreachableCaseError('ZSCCFNFI16179', value);
            }
        }

        export function tryTextToId(value: ZenithScanCriteria.MatchingField): ScanCriteria.TextFieldId | undefined {
            switch (value) {
                case ZenithScanCriteria.BoardTupleNodeType: return ScanCriteria.FieldId.Board;
                case ZenithScanCriteria.CallOrPutTupleNodeType: return ScanCriteria.FieldId.CallOrPut;
                case ZenithScanCriteria.CategoryTupleNodeType: return ScanCriteria.FieldId.Category;
                case ZenithScanCriteria.CfiTupleNodeType: return ScanCriteria.FieldId.Cfi;
                case ZenithScanCriteria.ClassTupleNodeType: return ScanCriteria.FieldId.Class;
                case ZenithScanCriteria.CodeTupleNodeType: return ScanCriteria.FieldId.Code;
                case ZenithScanCriteria.CurrencyTupleNodeType: return ScanCriteria.FieldId.Currency;
                case ZenithScanCriteria.DataTupleNodeType: return ScanCriteria.FieldId.Data;
                case ZenithScanCriteria.ExchangeTupleNodeType: return ScanCriteria.FieldId.Exchange;
                case ZenithScanCriteria.ExerciseTypeTupleNodeType: return ScanCriteria.FieldId.ExerciseType;
                case ZenithScanCriteria.LegTupleNodeType: return ScanCriteria.FieldId.Leg;
                case ZenithScanCriteria.MarketTupleNodeType: return ScanCriteria.FieldId.Market;
                case ZenithScanCriteria.NameTupleNodeType: return ScanCriteria.FieldId.Name;
                case ZenithScanCriteria.QuotationBasisTupleNodeType: return ScanCriteria.FieldId.QuotationBasis;
                case ZenithScanCriteria.StateTupleNodeType: return ScanCriteria.FieldId.State;
                case ZenithScanCriteria.StateAllowsTupleNodeType: return ScanCriteria.FieldId.StateAllows;
                case ZenithScanCriteria.StatusNoteTupleNodeType: return ScanCriteria.FieldId.StatusNote;
                case ZenithScanCriteria.TradingMarketTupleNodeType: return ScanCriteria.FieldId.TradingMarket;
                default:
                    return undefined;
            }
        }

        export function textFromId(value: ScanCriteria.TextFieldId): ZenithScanCriteria.MatchingField {
            switch (value) {
                case ScanCriteria.FieldId.Board: return ZenithScanCriteria.BoardTupleNodeType;
                case ScanCriteria.FieldId.CallOrPut: return ZenithScanCriteria.CallOrPutTupleNodeType;
                case ScanCriteria.FieldId.Category: return ZenithScanCriteria.CategoryTupleNodeType;
                case ScanCriteria.FieldId.Cfi: return ZenithScanCriteria.CfiTupleNodeType;
                case ScanCriteria.FieldId.Class: return ZenithScanCriteria.ClassTupleNodeType;
                case ScanCriteria.FieldId.Code: return ZenithScanCriteria.CodeTupleNodeType;
                case ScanCriteria.FieldId.Currency: return ZenithScanCriteria.CurrencyTupleNodeType;
                case ScanCriteria.FieldId.Data: return ZenithScanCriteria.DataTupleNodeType;
                case ScanCriteria.FieldId.Exchange: return ZenithScanCriteria.ExchangeTupleNodeType;
                case ScanCriteria.FieldId.ExerciseType: return ZenithScanCriteria.ExerciseTypeTupleNodeType;
                case ScanCriteria.FieldId.Leg: return ZenithScanCriteria.LegTupleNodeType;
                case ScanCriteria.FieldId.Market: return ZenithScanCriteria.MarketTupleNodeType;
                case ScanCriteria.FieldId.Name: return ZenithScanCriteria.NameTupleNodeType;
                case ScanCriteria.FieldId.QuotationBasis: return ZenithScanCriteria.QuotationBasisTupleNodeType;
                case ScanCriteria.FieldId.State: return ZenithScanCriteria.StateTupleNodeType;
                case ScanCriteria.FieldId.StateAllows: return ZenithScanCriteria.StateAllowsTupleNodeType;
                case ScanCriteria.FieldId.StatusNote: return ZenithScanCriteria.StatusNoteTupleNodeType;
                case ScanCriteria.FieldId.TradingMarket: return ZenithScanCriteria.TradingMarketTupleNodeType;
                default:
                    throw new UnreachableCaseError('ZSCCFBFI16179', value);
            }
        }

        export function booleanFromId(value: ScanCriteria.BooleanFieldId): ZenithScanCriteria.MatchingField {
            switch (value) {
                case ScanCriteria.FieldId.IsIndex: return ZenithScanCriteria.IsIndexTupleNodeType;
                default:
                    throw new UnreachableCaseError('ZSCCFBFI16179', value);
            }
        }

        export function tryBooleanToId(value: ZenithScanCriteria.MatchingField): ScanCriteria.BooleanFieldId | undefined {
            switch (value) {
                case ZenithScanCriteria.IsIndexTupleNodeType: return ScanCriteria.FieldId.IsIndex;
                default:
                    return undefined;
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
