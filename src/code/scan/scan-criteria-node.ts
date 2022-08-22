import Decimal from 'decimal.js-light';

export const enum ScanCriteriaNodeTypeId {
    // Boolean
    And,
    Or,
    Not,

    // Comparison
    Equals,
    GreaterThan,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual,
    All,
    None,

    // Binary arithmetic operations
    Add,
    Div,
    Mod,
    Mul,
    Sub,

    // Unary arithmetic operations
    Neg,
    Pos,
    Abs,

    // Get Field Value
    GetDecimalFieldValue,
    GetDecimalSubFieldValue,
    GetDateFieldValue,
    GetDateSubFieldValue,

    // Field Comparison
    FieldHasValue,
    BooleanFieldEquals,
    DecimalFieldEquals,
    DecimalFieldInRange,
    DateFieldEquals,
    DateFieldInRange,
    StringFieldContains,
    SubFieldHasValue,
    DecimalSubFieldEquals,
    DecimalSubFieldInRange,
    DateSubFieldEquals,
    DateSubFieldInRange,
    StringSubFieldContains,
}

export abstract class ScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId;
}

// All scan criteria which return a boolean descend from this
export abstract class BooleanScanCriteriaNode extends ScanCriteriaNode {

}

export abstract class ZeroOperandBooleanScanCriteriaNode extends BooleanScanCriteriaNode {
}

export abstract class SingleOperandBooleanScanCriteriaNode extends BooleanScanCriteriaNode {
    operand: BooleanScanCriteriaNode;
}

export abstract class LeftRightOperandBooleanScanCriteriaNode extends BooleanScanCriteriaNode {
    leftOperand: BooleanScanCriteriaNode;
    rightOperand: BooleanScanCriteriaNode;
}

export abstract class MultiOperandBooleanScanCriteriaNode extends BooleanScanCriteriaNode {
    operands: BooleanScanCriteriaNode[];
}

export class NoneScanCriteriaNode extends ZeroOperandBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.None;
}

export class AllScanCriteriaNode extends ZeroOperandBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.All;
}

export class NotScanCriteriaNode extends SingleOperandBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.Not;
}

export class EqualsScanCriteriaNode extends LeftRightOperandBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.Equals;
}

export class GreaterThanScanCriteriaNode extends LeftRightOperandBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.GreaterThan;
}

export class GreaterThanOrEqualScanCriteriaNode extends LeftRightOperandBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.GreaterThanOrEqual;
}

export class LessThanScanCriteriaNode extends LeftRightOperandBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.LessThan;
}

export class LessThanOrEqualScanCriteriaNode extends LeftRightOperandBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.LessThanOrEqual;
}

export class AndScanCriteriaNode extends MultiOperandBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.And;
}

export class OrScanCriteriaNode extends MultiOperandBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.Or;
}

export abstract class FieldBooleanScanCriteriaNode extends BooleanScanCriteriaNode {
    fieldName: string;
}

export class FieldHasValueScanCriteriaNode extends FieldBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.FieldHasValue;
}

export class BooleanFieldEqualsScanCriteriaNode extends FieldBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.BooleanFieldEquals;
    target: boolean | BooleanScanCriteriaNode;
}

export class DecimalFieldEqualsScanCriteriaNode extends FieldBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.DecimalFieldEquals;
    target: Decimal | DecimalScanCriteriaNode;
}

export class DecimalFieldInRangeScanCriteriaNode extends FieldBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.DecimalFieldInRange;
    min: Decimal | null | DecimalScanCriteriaNode;
    max: Decimal | null | DecimalScanCriteriaNode;
}

export class DateFieldEqualsScanCriteriaNode extends FieldBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.DateFieldEquals;
    target: Date | DateScanCriteriaNode;
}

export class DateFieldInRangeScanCriteriaNode extends FieldBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.DateFieldInRange;
    min: Date | null | DateScanCriteriaNode;
    max: Date | null | DateScanCriteriaNode;
}

export class StringFieldContainsScanCriteriaNode extends FieldBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.StringFieldContains;
    value: string;
    as: StringFieldContainsAs;
    ignoreCase: boolean;
}

export abstract class SubFieldBooleanScanCriteriaNode extends FieldBooleanScanCriteriaNode {
    subFieldName: string;
}

export class SubFieldHasValueScanCriteriaNode extends SubFieldBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.FieldHasValue;
}

export class DecimalSubFieldEqualsScanCriteriaNode extends SubFieldBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.DecimalSubFieldEquals;
    target: Decimal | DecimalScanCriteriaNode;
}

export class DecimalSubFieldInRangeScanCriteriaNode extends SubFieldBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.DecimalSubFieldInRange;
    min: Decimal | null | DecimalScanCriteriaNode;
    max: Decimal | null | DecimalScanCriteriaNode;
}

export class DateSubFieldEqualsScanCriteriaNode extends SubFieldBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.DateSubFieldEquals;
    target: Date | DateScanCriteriaNode;
}

export class DateSubFieldInRangeScanCriteriaNode extends SubFieldBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.DateSubFieldInRange;
    min: Date | null | DateScanCriteriaNode;
    max: Date | null | DateScanCriteriaNode;
}

export class StringSubFieldContainsScanCriteriaNode extends SubFieldBooleanScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.StringSubFieldContains;
    value: string;
    as: StringFieldContainsAs;
    ignoreCase: boolean;
}

// All scan criteria which return a Decimal descend from this
export abstract class DecimalScanCriteriaNode extends ScanCriteriaNode {

}

export abstract class UnaryArithmeticScanCriteriaNode extends DecimalScanCriteriaNode {
    operand: Decimal | DecimalScanCriteriaNode;
}

export class NegScanCriteriaNode extends UnaryArithmeticScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.Neg;
}

export class PosScanCriteriaNode extends UnaryArithmeticScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.Pos;
}

export class AbsScanCriteriaNode extends UnaryArithmeticScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.Abs;
}

export abstract class LeftRightArithmeticScanCriteriaNode extends DecimalScanCriteriaNode {
    leftOperand: Decimal | DecimalScanCriteriaNode;
    rightOperand: Decimal | DecimalScanCriteriaNode;
}

export class AddScanCriteriaNode extends LeftRightArithmeticScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.Add;
}

export class DivScanCriteriaNode extends LeftRightArithmeticScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.Div;
}

export class ModScanCriteriaNode extends LeftRightArithmeticScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.Mod;
}

export class MulScanCriteriaNode extends LeftRightArithmeticScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.Mul;
}

export abstract class SubScanCriteriaNode extends LeftRightArithmeticScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.Sub;
}

export class GetDecimalFieldValue extends DecimalScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.GetDecimalFieldValue;
    fieldName: string;
}

export class GetDecimalSubFieldValue extends DecimalScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.GetDecimalSubFieldValue;
    fieldName: string;
    subFieldName: string;
}

// All scan criteria which return a Date descend from this
export abstract class DateScanCriteriaNode extends ScanCriteriaNode {

}

export class GetDateFieldValue extends DateScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.GetDateFieldValue;
    fieldName: string;
}

export class GetDateSubFieldValue extends DateScanCriteriaNode {
    typeId: ScanCriteriaNodeTypeId.GetDateSubFieldValue;
    fieldName: string;
    subFieldName: string;
}

export const enum StringFieldContainsAs {
    None,
    FromStart,
    FromEnd,
    Exact,
}
