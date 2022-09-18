import { PickEnum } from '../../../../sys/sys-internal-api';
import { Zenith } from './zenith';

export namespace ZenithScanCriteria {
    // Due to TypeScript not supporting Circular References in some scenarios, we need 2 types of
    // Node declarations.  Unions which exactly define possible node types but cannot be used
    // in circular references and more general declarations.

    export type DateString = string;

    export type NodeType = keyof ParamTupleMap;

    export type TupleNode<T extends NodeType> = [T, ...ParamTupleMap[T]];

    // Logical Criteria Nodes
    export type AndNode = TupleNode<"And">;
    export type OrNode = TupleNode<"Or">;
    export type NotNode = TupleNode<"Not">;

    // Matching
    export type AltCodeNode = TupleNode<"AltCode">;
    export type AttributeNode = TupleNode<"Attribute">;
    export type AuctionNode = TupleNode<"Auction">;
    export type AuctionLastNode = TupleNode<"AuctionLast">;
    export type AuctionQuantityNode = TupleNode<"AuctionQuantity">;
    export type BestAskCountNode = TupleNode<"BestAskCount">;
    export type BestAskPriceNode = TupleNode<"BestAskPrice">;
    export type BestAskQuantityNode = TupleNode<"BestAskQuantity">;
    export type BestBidCountNode = TupleNode<"BestBidCount">;
    export type BestBidPriceNode = TupleNode<"BestBidPrice">;
    export type BestBidQuantityNode = TupleNode<"BestBidQuantity">;
    export type BoardNode = TupleNode<"Board">;
    export type CallOrPutNode = TupleNode<"CallOrPut">;
    export type CategoryNode = TupleNode<"Category">;
    export type CFINode = TupleNode<"CFI">;
    export type ClassNode = TupleNode<"Class">;
    export type ClosePriceNode = TupleNode<"ClosePrice">;
    export type CodeNode = TupleNode<"Code">;
    export type ContractSizeNode = TupleNode<"ContractSize">;
    export type CurrencyNode = TupleNode<"Currency">;
    export type DataNode = TupleNode<"Data">;
    export type DateNode = TupleNode<"Date">;
    export type ExerciseTypeNode = TupleNode<"ExerciseType">;
    export type ExchangeNode = TupleNode<"Exchange">;
    export type ExpiryDateNode = TupleNode<"ExpiryDate">;
    export type HighPriceNode = TupleNode<"HighPrice">;
    export type IsIndexNode = TupleNode<"IsIndex">;
    export type LegNode = TupleNode<"Leg">;
    export type LastPriceNode = TupleNode<"LastPrice">;
    export type LotSizeNode = TupleNode<"LotSize">;
    export type LowPriceNode = TupleNode<"LowPrice">;
    export type MarketNode = TupleNode<"Market">;
    export type NameNode = TupleNode<"Name">;
    export type OpenInterestNode = TupleNode<"OpenInterest">;
    export type OpenPriceNode = TupleNode<"OpenPrice">;
    export type PriceNode = TupleNode<"Price">;
    export type PreviousCloseNode = TupleNode<"PreviousClose">;
    export type QuotationBasisNode = TupleNode<"QuotationBasis">;
    export type RemainderNode = TupleNode<"Remainder">;
    export type ShareIssueNode = TupleNode<"ShareIssue">;
    export type StateNode = TupleNode<"State">;
    export type StateAllowsNode = TupleNode<"StateAllows">;
    export type StatusNoteNode = TupleNode<"StatusNote">;
    export type StrikePriceNode = TupleNode<"StrikePrice">;
    export type TradesNode = TupleNode<"Trades">;
    export type TradingMarketNode = TupleNode<"TradingMarket">;
    export type ValueTradedNode = TupleNode<"ValueTraded">;
    export type VolumeNode = TupleNode<"Volume">;
    export type VWAPNode = TupleNode<"VWAP">;

    // Comparison
    export type EqualNode = TupleNode<"=">;
    export type GreaterThanNode = TupleNode<">">;
    export type GreaterThanOrEqualNode = TupleNode<">=">;
    export type LessThanNode = TupleNode<"<">;
    export type LessThanOrEqualNode = TupleNode<"<=">;
    export type AllNode = TupleNode<"All">;
    export type NoneNode = TupleNode<"None">;

    // Binary
    export type AddNode = TupleNode<"Add">;
    export type SymbolDivNode = TupleNode<"/">;
    export type DivNode = TupleNode<"Div">;
    export type SymbolModNode = TupleNode<"%">;
    export type ModNode = TupleNode<"Mod">;
    export type SymbolMulNode = TupleNode<"*">;
    export type MulNode = TupleNode<"Mul">;
    export type SubNode = TupleNode<"Sub">;

    // Unary
    export type NegNode = TupleNode<"Neg">;
    export type PosNode = TupleNode<"Pos">;
    export type AbsNode = TupleNode<"Abs">;

    // Unary or Binary (depending on number of params)
    export type SymbolSubNegNode = TupleNode<"-">;
    export type SymbolAddPosNode = TupleNode<"+">;

    export const enum MatchingFieldEnum {
        AltCode = "AltCode",
        Attribute = "Attribute",
        Auction = "Auction",
        AuctionLast = "AuctionLast",
        AuctionQuantity = "AuctionQuantity",
        BestAskCount = "BestAskCount",
        BestAskPrice = "BestAskPrice",
        BestAskQuantity = "BestAskQuantity",
        BestBidCount = "BestBidCount",
        BestBidPrice = "BestBidPrice",
        BestBidQuantity = "BestBidQuantity",
        Board = "Board",
        CallOrPut = "CallOrPut",
        Category = "Category",
        CFI = "CFI",
        Class = "Class",
        ClosePrice = "ClosePrice",
        Code = "Code",
        ContractSize = "ContractSize",
        Currency = "Currency",
        Data = "Data",
        Date = "Date",
        Exchange = "Exchange",
        ExerciseType = "ExerciseType",
        ExpiryDate = "ExpiryDate",
        HighPrice = "HighPrice",
        IsIndex = "IsIndex",
        LastPrice = "LastPrice",
        Leg = "Leg",
        LotSize = "LotSize",
        LowPrice = "LowPrice",
        Market = "Market",
        Name = "Name",
        OpenInterest = "OpenInterest",
        OpenPrice = "OpenPrice",
        Price = "Price",
        PreviousClose = "PreviousClose",
        QuotationBasis = "QuotationBasis",
        Remainder = "Remainder",
        ShareIssue = "ShareIssue",
        State = "State",
        StateAllows = "StateAllows",
        StatusNote = "StatusNote",
        StrikePrice = "StrikePrice",
        Trades = "Trades",
        TradingMarket = "TradingMarket",
        ValueTraded = "ValueTraded",
        Volume = "Volume",
        VWAP = "VWAP",
    }

    export type MatchingField = keyof typeof MatchingFieldEnum;

    export const enum MatchingPriceSubFieldEnum {
        LastPrice = 'LastPrice',
    }
    export type MatchingPriceSubField = keyof typeof MatchingPriceSubFieldEnum;

    export const enum MatchingDateSubFieldEnum {
        Dividend = 'Dividend',
    }
    export type MatchingDateSubField = keyof typeof MatchingDateSubFieldEnum;

    export type MatchingAltCodeSubField = keyof typeof Zenith.MarketController.SearchSymbols.AlternateKey;
    export type MatchingAttributeSubField = keyof typeof Zenith.MarketController.SearchSymbols.KnownAttributeKey;
    export type MatchingTextSubField = MatchingAltCodeSubField | MatchingAttributeSubField;

    export type LogicalNodeUnion = AndNode | OrNode | NotNode;
    export type LogicalNode = [nodeType: NodeType, ...params: unknown[]];

    export type MatchingNodeUnion =
        AltCodeNode |
        AttributeNode |
        AuctionNode |
        AuctionLastNode |
        AuctionQuantityNode |
        BestAskCountNode |
        BestAskPriceNode |
        BestAskQuantityNode |
        BestBidCountNode |
        BestBidPriceNode |
        BestBidQuantityNode |
        BoardNode |
        CallOrPutNode |
        CategoryNode |
        CFINode |
        ClassNode |
        ClosePriceNode |
        CodeNode |
        ContractSizeNode |
        CurrencyNode |
        DataNode |
        DateNode |
        ExerciseTypeNode |
        ExchangeNode |
        ExpiryDateNode |
        HighPriceNode |
        IsIndexNode |
        LegNode |
        LastPriceNode |
        LotSizeNode |
        LowPriceNode |
        MarketNode |
        NameNode |
        OpenInterestNode |
        OpenPriceNode |
        PriceNode |
        PreviousCloseNode |
        QuotationBasisNode |
        RemainderNode |
        ShareIssueNode |
        StateNode |
        StateAllowsNode |
        StatusNoteNode |
        StrikePriceNode |
        TradesNode |
        TradingMarketNode |
        ValueTradedNode |
        VolumeNode |
        VWAPNode;

    export type MatchingNode = [nodeType: MatchingFieldEnum, param1?: unknown, param2?: unknown, param3?: unknown, param4?: unknown, param5?: unknown];

    export type ComparisonNodeUnion =
        EqualNode |
        GreaterThanNode |
        GreaterThanOrEqualNode |
        LessThanNode |
        LessThanOrEqualNode;

    export type ComparisonNode = [nodeType: NodeType, leftParam: unknown, rightParam: unknown];

    export type AllNoneNodeUnion =
        AllNode |
        NoneNode;

    export type BinaryExpressionNodeUnion =
        AddNode |
        SymbolDivNode |
        DivNode |
        SymbolModNode |
        ModNode |
        SymbolMulNode |
        MulNode |
        SubNode;

    export type BinaryExpressionNode = [nodeType: NodeType, leftParam: unknown, rightParam: unknown];

    export type UnaryExpressionNodeUnion =
        NegNode |
        PosNode |
        AbsNode;

    export type UnaryExpressionNode = [nodeType: NodeType, param: unknown];

    export type UnaryOrBinaryExpressionNodeUnion =
        SymbolSubNegNode |
        SymbolAddPosNode;

    export type UnaryOrBinaryExpressionNode = [nodeType: NodeType, leftOrUnaryparam: unknown, rightParam?: unknown];

    export type BooleanNodeUnion = LogicalNodeUnion | MatchingNodeUnion | ComparisonNodeUnion | AllNoneNodeUnion;
    export type BooleanNode = LogicalNode | MatchingNode | ComparisonNode | AllNoneNodeUnion| MatchingField;
    export type NumericNodeUnion = UnaryExpressionNodeUnion | BinaryExpressionNodeUnion | UnaryOrBinaryExpressionNodeUnion;
    export type NumericNode = UnaryExpressionNode | BinaryExpressionNode | UnaryOrBinaryExpressionNode | MatchingField;
    export type AnyNodeUnion = BooleanNodeUnion | NumericNodeUnion;
    export type AnyNode = BooleanNode | NumericNode;

    export type NoParams = [];
    export type LogicalUnionParams = (boolean | BooleanNodeUnion)[];
    export type LogicalParams = (boolean | BooleanNode)[];

    export interface TextNamedParameters {
        As?: TextContainsAsEnum;
        IgnoreCase?: boolean;
    }
    export interface NumericNamedParameters {
        At?: number; // Set for equals
        Min?: number; // Set for "in range (inclusive)" or "greater than or equal"
        Max?: number; // Set for "in range (inclusive)" or "less than or equal"
    }
    export interface DateNamedParameters {
        At?: DateString; // Set for equals
        Min?: DateString; // Set for "in range (inclusive)" or "greater than or equal"
        Max?: DateString; // Set for "in range (inclusive)" or "less than or equal"
    }

    export type NumericUnion = number | NumericNodeUnion;
    export type NumericParam = number | NumericNode | ComparableField;
    export type SingleNumericUnionParams = [value: NumericUnion];
    export type SingleNumericParams = [value: NumericParam];
    export type LeftRightNumericUnionParams = [left: NumericUnion, right: NumericUnion];
    export type LeftRightNumericParams = [left: NumericParam, right: NumericParam];
    export type SingleOrLeftRightNumericUnionParams = SingleNumericUnionParams | LeftRightNumericUnionParams;
    export type SingleOrLeftRightNumericParams = SingleNumericParams | LeftRightNumericParams;
    export type NumericParams = SingleNumericParams | LeftRightNumericParams;

    export type TextParams_FirstForm = [field: MatchingField]; // exists
    export type TextParams_SecondForm = [field: MatchingField, value: string]; // Contains
    export type TextParams_ThirdForm = [field: MatchingField, value: string, as?: TextContainsAsEnum, ignoreCase?: boolean]; // Advanced contains
    export type TextParams_FourthForm = [field: MatchingField, value: string, namedParameters: TextNamedParameters];
    export type TextParams = TextParams_FirstForm | TextParams_SecondForm | TextParams_ThirdForm | TextParams_FourthForm;

    export type NamedTextParams_FirstForm = [field: MatchingField, subField: MatchingTextSubField]; // exists
    export type NamedTextParams_SecondForm = [field: MatchingField, subField: MatchingTextSubField, value: string]; // Contains
    export type NamedTextParams_ThirdForm = [field: MatchingField, subField: MatchingTextSubField, value: string, as?: TextContainsAsEnum, ignoreCase?: boolean]; // Advanced contains
    export type NamedTextParams_FourthForm = [field: MatchingField, subField: MatchingTextSubField, value: string, namedParameters: TextNamedParameters];
    export type NamedTextParams = NamedTextParams_FirstForm | NamedTextParams_SecondForm | NamedTextParams_ThirdForm | NamedTextParams_FourthForm;

    export type NumericRangeParams_FirstForm = [field: MatchingField]; // exists
    export type NumericRangeParams_SecondForm = [field: MatchingField, value: number]; // equals
    export type NumericRangeParams_ThirdForm = [field: MatchingField, value: number, min: number | null, max: number | null]; // in range
    export type NumericRangeParams_ForthForm = [field: MatchingField, namedParameters: NumericNamedParameters];
    export type NumericRangeParams =
        NumericRangeParams_FirstForm |
        NumericRangeParams_SecondForm |
        NumericRangeParams_ThirdForm |
        NumericRangeParams_ForthForm;

    export type NumericNamedRangeParams_FirstForm = [field: MatchingField, subField: MatchingPriceSubField]; // exists
    export type NumericNamedRangeParams_SecondForm = [field: MatchingField, subField: MatchingPriceSubField, value: number]; // equals
    export type NumericNamedRangeParams_ThirdForm = [field: MatchingField, subField: MatchingPriceSubField, min: number | null, max: number | null]; // in range
    export type NumericNamedRangeParams_ForthForm = [field: MatchingField, subField: MatchingPriceSubField, namedParameters: NumericNamedParameters];
    export type NumericNamedRangeParams =
        NumericNamedRangeParams_FirstForm |
        NumericNamedRangeParams_SecondForm |
        NumericNamedRangeParams_ThirdForm |
        NumericNamedRangeParams_ForthForm;

    export type DateRangeParams_FirstForm = [field: MatchingField]; // exists
    export type DateRangeParams_SecondForm = [field: MatchingField, value: DateString]; // equals
    export type DateRangeParams_ThirdForm = [field: MatchingField, min: DateString | null, max: DateString | null]; // in range
    export type DateRangeParams_ForthForm = [field: MatchingField, namedParameters: DateNamedParameters]; // equals
    export type DateRangeParams =
        DateRangeParams_FirstForm |
        DateRangeParams_SecondForm |
        DateRangeParams_ThirdForm |
        DateRangeParams_ForthForm;

    export type DateNamedRangeParams_FirstForm = [field: MatchingField, subField: MatchingDateSubField]; // exists
    export type DateNamedRangeParams_SecondForm = [field: MatchingField, subField: MatchingDateSubField, value: DateString]; // equals
    export type DateNamedRangeParams_ThirdForm = [field: MatchingField, subField: MatchingDateSubField, min: DateString | null, max: DateString | null]; // in range
    export type DateNamedRangeParams_ForthForm = [field: MatchingField, subField: MatchingDateSubField, namedParameters: DateNamedParameters];
    export type DateNamedRangeParams =
        DateNamedRangeParams_FirstForm |
        DateNamedRangeParams_SecondForm |
        DateNamedRangeParams_ThirdForm |
        DateNamedRangeParams_ForthForm;

    export type SingleParam_EqualsValue = [value: boolean | number | string]; // equals
    export type SingleParam_EqualsDefault = []; // equals default
    export type SingleParam_IsSet = []; // is set
    export type SingleParam = SingleParam_EqualsValue; // equals value or equals default
    export type SingleParam_Default = SingleParam_EqualsValue | SingleParam_EqualsDefault; // equals value or equals default
    export type SingleParam_Exists = SingleParam_EqualsValue | SingleParam_IsSet; // equals value or is set

    export interface ParamTupleMap {
        // Logical
        "And": LogicalParams;
        "Not": LogicalParams;
        "Or": LogicalParams;

        // Matching
        "AltCode": NamedTextParams;
        "Attribute": NamedTextParams;
        "Auction": NumericRangeParams;
        "AuctionLast": NumericRangeParams;
        "AuctionQuantity": NumericRangeParams;
        "BestAskCount": NumericRangeParams;
        "BestAskPrice": NumericRangeParams;
        "BestAskQuantity": NumericRangeParams;
        "BestBidCount": NumericRangeParams;
        "BestBidPrice": NumericRangeParams;
        "BestBidQuantity": NumericRangeParams;
        "Board": SingleParam;
        "CallOrPut": SingleParam_Exists;
        "Category": SingleParam;
        "CFI": SingleParam;
        "Class": SingleParam;
        "ClosePrice": NumericRangeParams;
        "Code": TextParams;
        "ContractSize": NumericRangeParams;
        "Currency": SingleParam;
        "Data": SingleParam;
        "Date": DateNamedRangeParams;
        "ExerciseType": SingleParam_Exists;
        "Exchange": SingleParam;
        "ExpiryDate": DateRangeParams;
        "HighPrice": NumericRangeParams;
        "IsIndex": SingleParam_Default;
        "Leg": SingleParam;
        "LastPrice": NumericRangeParams;
        "LotSize": NumericRangeParams;
        "LowPrice": NumericRangeParams;
        "Market": SingleParam;
        "Name": TextParams;
        "OpenInterest": NumericRangeParams;
        "OpenPrice": NumericRangeParams;
        "Price": NumericNamedRangeParams;
        "PreviousClose": NumericRangeParams;
        "QuotationBasis": SingleParam;
        "Remainder": NumericRangeParams;
        "ShareIssue": NumericRangeParams;
        "State": SingleParam;
        "StateAllows": SingleParam;
        "StatusNote": SingleParam;
        "StrikePrice": NumericRangeParams;
        "Trades": NumericRangeParams;
        "TradingMarket": SingleParam;
        "ValueTraded": NumericRangeParams;
        "Volume": NumericRangeParams;
        "VWAP": NumericRangeParams;

        // Comparison
        "=": LeftRightNumericParams;
        ">": LeftRightNumericParams;
        ">=": LeftRightNumericParams;
        "<": LeftRightNumericParams;
        "<=": LeftRightNumericParams;
        "All": NoParams;
        "None": NoParams;

        // Binary
        "Add": LeftRightNumericParams;
        "/": LeftRightNumericParams;
        "Div": LeftRightNumericParams;
        "%": LeftRightNumericParams;
        "Mod": LeftRightNumericParams;
        "*": LeftRightNumericParams;
        "Mul": LeftRightNumericParams;
        "Sub": LeftRightNumericParams;

        // Unary
        "Neg": SingleNumericParams;
        "Pos": SingleNumericParams;
        "Abs": SingleNumericParams;

        // Unary or Binary (depending on number of params)
        "-": SingleOrLeftRightNumericParams;
        "+": SingleOrLeftRightNumericParams;
    }

    // export type ComparableField = MatchingField; // actually only subset
    export type ComparableField = PickEnum<MatchingField,
        MatchingFieldEnum.Auction |
        MatchingFieldEnum.AuctionLast |
        MatchingFieldEnum.AuctionQuantity |
        MatchingFieldEnum.BestAskCount |
        MatchingFieldEnum.BestAskPrice |
        MatchingFieldEnum.BestAskQuantity |
        MatchingFieldEnum.BestBidCount |
        MatchingFieldEnum.BestBidPrice |
        MatchingFieldEnum.BestBidQuantity |
        MatchingFieldEnum.ClosePrice |
        MatchingFieldEnum.ContractSize |
        MatchingFieldEnum.HighPrice |
        MatchingFieldEnum.LastPrice |
        MatchingFieldEnum.LotSize |
        MatchingFieldEnum.LowPrice |
        MatchingFieldEnum.OpenInterest |
        MatchingFieldEnum.OpenPrice |
        MatchingFieldEnum.PreviousClose |
        MatchingFieldEnum.Price |
        MatchingFieldEnum.Remainder |
        MatchingFieldEnum.ShareIssue |
        MatchingFieldEnum.StrikePrice |
        MatchingFieldEnum.Trades |
        MatchingFieldEnum.ValueTraded |
        MatchingFieldEnum.Volume |
        MatchingFieldEnum.VWAP
    >;

    // export const enum ComparableFieldEnum {
    //     Auction = 'Auction',
    //     AuctionLast = 'AuctionLast',
    //     AuctionQuantity = 'AuctionQuantity',
    //     BestAskCount = 'BestAskCount',
    //     BestAskPrice = 'BestAskPrice',
    //     BestAskQuantity = 'BestAskQuantity',
    //     BestBidCount = 'BestBidCount',
    //     BestBidPrice = 'BestBidPrice',
    //     BestBidQuantity = 'BestBidQuantity',
    //     ClosePrice = 'ClosePrice',
    //     ContractSize = 'ContractSize',
    //     HighPrice = 'HighPrice',
    //     LastPrice = 'LastPrice',
    //     LotSize = 'LotSize',
    //     LowPrice = 'LowPrice',
    //     OpenInterest = 'OpenInterest',
    //     OpenPrice = 'OpenPrice',
    //     PreviousClose = 'PreviousClose',
    //     Price = 'Price',
    //     Remainder = 'Remainder',
    //     ShareIssue = 'ShareIssue',
    //     StrikePrice = 'StrikePrice',
    //     Trades = 'Trades',
    //     ValueTraded = 'ValueTraded',
    //     Volume = 'Volume',
    //     VWAP = 'VWAP',
    // }

    // export type ComparableField = keyof typeof ComparableFieldEnum;

    export const enum TextContainsAsEnum {
        None = 'None',
        FromStart = 'FromStart',
        FromEnd = 'FromEnd',
        Exact = 'Exact',
    }
}
