/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

export const enum ErrorCode {
    CommaText_UnexpectedCharAfterQuotedElement = 'CTUCAQE69316',
    CommaText_QuotesNotClosedInLastElement = 'CTQNCALE69316',
    CommaText_IntegerParseStringArray = 'CTIPSA69316',
    CommaText_InvalidIntegerString = 'CTIIS69316',
    JsonElement_TryGetElement = 'JSTGE11145',
    LockOpenList_TryLockItemByKey = 'LOLTLIBK29998',
    LockOpenList_TryLockItemAtIndex = 'LOLTLIAI29998',
    LockOpenList_TryOpenItemByKey = 'LOLTOIBK29998',
    LockOpenList_TryOpenItemAtIndex = 'LOLTOIAI29998',
    LockOpenList_EntryTryLockProcessFirst = 'LOLETLPF29998',
    LockOpenList_EntryTryOpenLock = 'LOLETOL29998',
    LockOpenList_EntryTryOpenTryOpenLocked = 'LOLETOTOL29998',
    LockOpenList_EntryTryOpenLockedProcessFirst = 'LOLETOLPF29998',
    PublisherId_TypeIsNotSpecified = 'PITINS15007',
    PublisherId_TypeIsInvalid = 'PITII15007',
    PublisherId_NameIsInvalid = 'PIDNII15007',
    PublisherId_NameIsNotSpecified = 'PININS15007',
    ExtensionId_PublisherIdIsNotSpecified = 'EIPINS55266',
    ExtensionId_PublisherIdIsInvalid = 'EIPII55266',
    ExtensionId_ExtensionNameIsNotSpecifiedOrInvalid = 'EIENINSOI55266',
    ExtensionInfo_ExtensionIdIsNotSpecifiedOrInvalid = 'EIEIINSOI55267',
    ExtensionInfo_VersionIsNotSpecifiedOrInvalid = 'EIVINSOI55267',
    ExtensionInfo_ApiVersionIsNotSpecifiedOrInvalid = 'EIAVINSOI55267',
    ExtensionInfo_ShortDescriptionIsNotSpecifiedOrInvalid = 'EISDINSOI55267',
    ExtensionInfo_LongDescriptionIsNotSpecifiedOrInvalid = 'EILDINSOI55267',
    ExtensionInfo_UrlPathIsNotSpecifiedOrInvalid = 'EIUPINSOI55267',
    ExtensionInfo_UrlPathIsInvalid = 'EIUPII55267',
    IvemId_CodeNotSpecified = 'IICNS45456',
    IvemId_ExchangeNotSpecified = 'IIENS45456',
    IvemId_ExchangeIsInvalid = 'IIEII45456',
    LitIvemId_TryCreateFromJsonMarketNotSpecified = 'LIITCFJMNS42297',
    LitIvemId_TryCreateFromJsonMarketIsInvalid = 'LIITCFJMII42297',
    LitIvemId_TryCreateFromJsonCodeNotSpecified = 'LIITCFJCNS42297',
    LitIvemId_TryCreateFromJsonEnvironmentNotSpecified = 'LIITCFJENS42297',
    LitIvemId_TryCreateFromJsonEnvironmentIsInvalid = 'LIITCFJEII42297',
    LitIvemId_TryCreateArrayFromJsonElementArray = 'LIITCAFHEA42297',
    RoutedIvemId_IvemIdNotSpecified = 'RIIIINS88223',
    RoutedIvemId_IvemIdIsInvalid = 'RIIIIII88223',
    RoutedIvemId_RouteNotSpecified = 'RIIRNS88223',
    RoutedIvemId_RouteIsInvalid = 'RIIRII88223',
    RoutedIvemId_TryCreateArrayFromJsonElementArray = 'ROOTCAFJEA88223',
    OrderRoute_AlgorithmNotSpecified = 'ORANS49945',
    OrderRoute_AlgorithmIsUnknown = 'ORAIUK49945',
    OrderRoute_AlgorithmIsUnsupported = 'ORAIUS49945',
    MarketOrderRoute_MarketNotSpecified = 'MORMNS49945',
    MarketOrderRoute_MarketIsUnknown = 'MORMIU49945',
    Account_IdNotSpecified = 'AINS22245',
    Account_EnvironmentIdIsInvalid = 'AEIII22245',
    SingleBrokerageAccountGroup_AccountKeyNotSpecified = 'SBAGAKNS20998',
    SingleBrokerageAccountGroup_AccountKeyIsInvalid = 'SBAGAKII20998',
    BrokerageAccountGroup_TypeIdIsInvalid = 'BAGTIII54546',
    BrokerageAccountGroup_TypeIdIsUnknown = 'BAGTIIUK54546',
    BrokerageAccountGroup_SingleInvalid = 'BAGSI54546',
    BrokerageAccountGroup_TypeIdIsUnsupported = 'BAGTIIUS54546',
    ZenithDepthMessage_CreateOrderDoesNotIncludeSide = 'ZDMCODNIS10945',
    ZenithDepthMessage_CreateOrderDoesNotIncludePrice = 'ZDMCODNIPR10945',
    ZenithDepthMessage_CreateOrderDoesNotIncludePosition = 'ZDMCODNIPO10945',
    ZenithDepthMessage_CreateOrderDoesNotIncludeQuantity = 'ZDMCODNIQ10945',
    ZenithDepthMessage_InsertOrderIdAlreadyExists = 'ZDMIOIAE10945',
    ZenithDepthMessage_DeleteOrderDoesNotContainId = 'ZDMDODNCI10945',
    ZenithDepthMessage_AddChangeDoesNotContainOrder = 'ZDMADDNCO10945',
    ZenithDepthMessage_UpdateChangeDoesNotContainOrder = 'ZDMUCDNCO10945',
    ZenithDepthMessage_RemoveChangeDoesNotContainOrder = 'ZDMRCDNCO10945',
    ZenithDepthMessage_UpdateOrderNotFound = 'ZDMUONF10945',
    ZenithDepthMessage_UpdateOrderOnWrongSide = 'ZDMUOOWS10945',
    ZenithDepthMessage_ChangeOrderMoveOverExistingOrder = 'ZDMCOVOEO10945',
    ZenithDepthMessage_ChangePriceToSingleExistingPrice = 'ZDMCPTSEP10945',
    ZenithDepthMessage_ChangePositionToExistingPosition = 'ZDMCPTEP10945',
    SymbolsServiceParseModeJsonValueToId = 'SSPMJVTI',
    SymbolsServiceExchangeHideModeJsonValueToId = 'SSEHMJVTI',
    CallPutTableRecordDefinitionLoadFromJsonKeyUndefined = 'CPTRDLFJKU',
    CallPutTableRecordDefinitionLoadFromJsonKeyError = 'CPTRDLFJKE',
    TopShareholderTableRecordDefinitionLoadFromJsonKeyUndefined = 'TSTRDLFJKU',
    TopShareholderTableRecordDefinitionLoadFromJsonKeyError = 'TSTRDLFJKE',
    ExtensionsService_PublisherTypeNotSpecified = 'ESPTNS30301',
    ExtensionsService_InvalidPublisherType = 'ESIPT30301',
    ExtensionsService_IsEnabledHandleExtensionUndefined = 'ESIEHEU30301',
    ExtensionsService_GetNameHandleExtensionUndefined = 'ESGNHEU30301',
    ExtensionsService_GetPublisherHandleExtensionUndefined = 'ESGPNHEU30301',
    ExtensionsService_AddDuplicateName = 'ESADN30301',
    ExtensionsService_MismatchedExtensionInfo = 'ESMEI30301',
    WatchmakerLitIvemIdListDefinition_IdIsInvalid = 'WMLIILDIII87722',
    WatchmakerLitIvemIdListDefinition_WatchmakerListIdIsInvalid = 'WMLIILDWLIII87722',
    ScanList_InsertAlreadyExistingScan = 'SLIAES05822',
    ScansService_TryOpenScanEditor_LockScan = 'SSTOCELC67341',
    ZenithEncodedScanFormulaDecode_BooleanTupleNodeIsNotAnArray = 'ZSCPBTNINAA05822',
    ZenithEncodedScanFormulaDecode_BooleanTupleNodeArrayIsZeroLength = 'ZSCPBTNAIZL11638',
    ZenithEncodedScanFormulaDecode_BooleanTupleNodeTypeIsNotString = 'ZSCPBTNTINS96220',
    ZenithEncodedScanFormulaDecode_LogicalBooleanMissingOperands = 'ZSCPLBMO15996',
    ZenithEncodedScanFormulaDecode_LogicalBooleanMissingOperand = 'ZSCPLBMO21100',
    ZenithEncodedScanFormulaDecode_NumericComparisonDoesNotHave2Operands = 'ZSCPNCDNH2O10100',
    ZenithEncodedScanFormulaDecode_NumericParameterIsNotNumberOrComparableFieldOrArray = 'ZSCPNPINNOCFOA60611',
    ZenithEncodedScanFormulaDecode_UnexpectedBooleanParamType = 'ZSCPUBPT11886',
    ZenithEncodedScanFormulaDecode_UnknownFieldBooleanParam = 'ZSCPUFBP11887',
    ZenithEncodedScanFormulaDecode_SubFieldIsNotString = 'ZSCPSFINS11888',
    ZenithEncodedScanFormulaDecode_PriceSubFieldHasValueSubFieldIsUnknown = 'ZSCPPSFHVSFIU11889',
    ZenithEncodedScanFormulaDecode_DateSubFieldHasValueSubFieldIsUnknown = 'ZSCPDSFHVSFIU11890',
    ZenithEncodedScanFormulaDecode_AltCodeSubFieldHasValueSubFieldIsUnknown = 'ZSCPACSFHVSFPIU11891',
    ZenithEncodedScanFormulaDecode_AttributeSubFieldHasValueSubFieldIsUnknown = 'ZSCPASFHVSFIU11892',
    ZenithEncodedScanFormulaDecode_TargetIsNotNumber = 'ZSCPTINN11893',
    ZenithEncodedScanFormulaDecode_RangeMinIsDefinedButNotNumber = 'ZSCPRMIDBNN11894',
    ZenithEncodedScanFormulaDecode_RangeMaxIsDefinedButNotNumber = 'ZSCPRMIDBNN11895',
    ZenithEncodedScanFormulaDecode_RangeMinAndMaxAreBothUndefined = 'ZSCPRMAMABU11896',
    ZenithEncodedScanFormulaDecode_DateFieldEqualsTargetIsNotString = 'ZSCPDFETINS11897',
    ZenithEncodedScanFormulaDecode_TextFieldContainsValueIsNotString = 'ZSCPTFCVINS11898',
    ZenithEncodedScanFormulaDecode_TextFieldContainsAsIsNotString = 'ZSCPTFCAINS11899',
    ZenithEncodedScanFormulaDecode_TextFieldContainsAsHasInvalidFormat = 'ZSCPTFCAHIF11900',
    ZenithEncodedScanFormulaDecode_TextFieldContainsAsIsNotBoolean = 'ZSCPTFCAINB11901',
    ZenithEncodedScanFormulaDecode_BooleanFieldEqualsTargetIsNotBoolean = 'ZSCPBFETINB11902',
    ZenithEncodedScanFormulaDecode_PriceSubFieldEqualsSubFieldIsUnknown = 'ZSCPPSFESFIU11903',
    ZenithEncodedScanFormulaDecode_DateSubFieldEqualsSubFieldIsUnknown = 'ZSCPDSFESFIU11904',
    ZenithEncodedScanFormulaDecode_DateSubFieldEqualsTargetIsNotString = 'ZSCPDSFETINS11905',
    ZenithEncodedScanFormulaDecode_AltCodeSubFieldContainsSubFieldIsUnknown = 'ZSCPACSFCSFIU11906',
    ZenithEncodedScanFormulaDecode_AttributeSubFieldContainsSubFieldIsUnknown = 'ZSCPASFCSFIU11907',
    ZenithEncodedScanFormulaDecode_TargetHasInvalidDateFormat = 'ZSCPTHIDF11908',
    ZenithEncodedScanFormulaDecode_RangeMinIsDefinedButNotString = 'ZSCPRMIDBNS11909',
    ZenithEncodedScanFormulaDecode_RangeMinHasInvalidDateFormat = 'ZSCPRMHIDF11910',
    ZenithEncodedScanFormulaDecode_RangeMaxIsDefinedButNotString = 'ZSCPRMIDBNS11911',
    ZenithEncodedScanFormulaDecode_RangeMaxHasInvalidDateFormat = 'ZSCPRMHIDF11912',
    ZenithEncodedScanFormulaDecode_NamedParametersCannotBeNull = 'ZSCPNPCBN11913',
    ZenithEncodedScanFormulaDecode_FirstParameterCannotBeObjectOrNull = 'ZSCPFPCBOON11914',
    ZenithEncodedScanFormulaDecode_SecondParameterCannotBeObjectOrNull = 'ZSCPSPCBOON11915',
    ZenithEncodedScanFormulaDecode_BooleanFieldCanOnlyHaveOneParameter = 'ZSCPBFCOHOP11916',
    ZenithEncodedScanFormulaDecode_OnlySubFieldOrTextFieldNodesCanHave3Parameters = 'ZSCPOSFOTFNCH3P11917',
    ZenithEncodedScanFormulaDecode_OnlySubFieldNodeCanHave4Parameters = 'ZSCPOSFNCH4P11918',
    ZenithEncodedScanFormulaDecode_OnlyTextSubFieldContainsNodeCanHave4Parameters = 'ZSCPOTSFCNCH4P11919',
    ZenithEncodedScanFormulaDecode_FieldBooleanNodeHasTooManyParameters = 'ZSCPFBNHTMP11920',
    ZenithEncodedScanFormulaDecode_NumericTupleNodeIsZeroLength = 'ZSCPNTNIZL11921',
    ZenithEncodedScanFormulaDecode_NumericTupleNodeTypeIsNotString = 'ZSCPNTNTINS11922',
    ZenithEncodedScanFormulaDecode_NumericTupleNodeRequires2Or3Parameters = 'ZSCPNTNR2O3P11923',
    ZenithEncodedScanFormulaDecode_UnaryArithmeticNumericTupleNodeRequires2Parameters = 'ZSCPUANTNR2P11924',
    ZenithEncodedScanFormulaDecode_LeftRightArithmeticNumericTupleNodeRequires3Parameters = 'ZSCPLRANTNR3P11925',
    ZenithEncodedScanFormulaDecode_UnknownBooleanTupleNodeType = 'ZSCPUBTNT11926',
    ZenithEncodedScanFormulaDecode_UnknownNumericTupleNodeType = 'ZSCPUNTNT11927',
    ZenithEncodedScanFormulaDecode_UnknownNumericField = 'ZSCPUNF11928',
    ZenithEncodedScanFormulaDecode_IfTupleNodeRequiresAtLeast4Parameters = 'ZSCPITNRAL4P11929',
    ZenithEncodedScanFormulaDecode_IfTupleNodeRequiresAnEvenNumberOfParameters = 'ZSCPITNRAENOP11930',
    ZenithMessageConvert_CreateScan_Controller = 'ZMCCSC30666',
    ZenithMessageConvert_CreateScan_Action = 'ZMCCSA30666',
    ZenithMessageConvert_CreateScan_Topic = 'ZMCCST30666',
    ZenithMessageConvert_QueryScan_Controller = 'ZMCQSC44923',
    ZenithMessageConvert_QueryScan_Action = 'ZMCQSA44923',
    ZenithMessageConvert_QueryScan_Topic = 'ZMCQST44923',
    ZenithMessageConvert_Scans_Controller = 'ZMCSC69113',
    ZenithMessageConvert_Scans_Action = 'ZMCSA69113',
    ZenithMessageConvert_Scans_PublishTopic = 'ZMCSPT69113',
    ZenithMessageConvert_Scans_SubTopic = 'ZMCSSTS69113',
    ZenithMessageConvert_Scans_AddUpdateMissingScan = 'ZMCSAUMS69113',
    ZenithMessageConvert_Scans_RemoveMissingScan = 'ZMCSRMS69113',
    ZenithMessageConvert_Matches_Controller = 'ZMCMC69113',
    ZenithMessageConvert_Matches_Action = 'ZMCMA69113',
    ZenithMessageConvert_Matches_PublishTopic = 'ZMCMPT69113',
    ZenithMessageConvert_Matches_SubTopic = 'ZMCMSTS69113',
    ZenithMessageConvert_Matches_AddUpdateMissingKey = 'ZMCMAUMK69113',
    ZenithMessageConvert_Matches_RemoveMissingKey = 'ZMCMRMK69113',
    ZenithMessageConvert_Watchlist_Controller = 'ZMCWC69114',
    ZenithMessageConvert_LitIvemIdCreateWatchmakerList_Action = 'ZMCLIICWLA69114',
    ZenithMessageConvert_LitIvemIdCreateWatchmakerList_Topic = 'ZMCLIICWLT69114',
    ZenithMessageConvert_CopyWatchmakerList_Action = 'ZMCCWLA69114',
    ZenithMessageConvert_CopyWatchmakerList_Topic = 'ZMCCWLT69114',
    ZenithMessageConvert_DeleteWatchmakerList_Action = 'ZMCDWLA69114',
    ZenithMessageConvert_DeleteWatchmakerList_Topic = 'ZMCDWLT69114',
    ZenithMessageConvert_UpdateWatchmakerList_Action = 'ZMCUWLA69114',
    ZenithMessageConvert_UpdateWatchmakerList_Topic = 'ZMCUWLT69114',
    ZenithMessageConvert_AddToWatchmakerList_Action = 'ZMCATWLA69114',
    ZenithMessageConvert_AddToWatchmakerList_Topic = 'ZMCATWLT69114',
    ZenithMessageConvert_InsertIntoWatchmakerList_Action = 'ZMCIIWLA69114',
    ZenithMessageConvert_InsertIntoWatchmakerList_Topic = 'ZMCIIWLT69114',
    ZenithMessageConvert_MoveInWatchmakerList_Action = 'ZMCMIWLA69114',
    ZenithMessageConvert_MoveInWatchmakerList_Topic = 'ZMCMIWLT69114',
    ZenithMessageConvert_Watchlists_PublishTopic = 'ZMCWSPT45071',
    ZenithMessageConvert_Watchlists_SubTopic = 'ZMCWSST45071',
    ZenithMessageConvert_Watchlists_Action = 'ZMCWSA45071',
    ZenithMessageConvert_Watchlists_AddUpdateMissingWatchlist = 'ZMCWSAYMW45071',
    ZenithMessageConvert_Watchlists_UndefinedIsWritable = 'ZMCWSUIW45071',
    ZenithMessageConvert_Watchlists_RemoveMissingWatchlist = 'ZMCWSRMW45071',
    ZenithMessageConvert_Watchlist_Action = 'ZMCWA45071',
    ZenithMessageConvert_QueryMembers_PublishTopic = 'ZMCQMPT45071',
    ZenithMessageConvert_Watchlist_SubTopic = 'ZMCWST45071',
    ZenithCalculateMarketId_CfxUndefinedDefault = 'ZCMICUDD91007',
    ZenithCalculateMarketId_CfxUnsupportedM2Node = 'ZCMICUM2N91007',
    ZenithCalculateMarketId_CfxUnsupportedM1Node = 'ZCMICUM1N91007',
    ZenithCalculateMarketBoardId_UnsupportedCfxM2Node = 'ZCMBIUSM2N91007',
    LitIvemIdListDefinition_TryGetIdFromJson = 'ILIILDTGIFJ97113',
    LitIvemIdListDefinition_TryGetTypeIdFromJson = 'LIILDTGTIFJ74660',
    LitIvemIdListDefinition_TypeIdUnknown = 'LIILDYIU74660',
    LitIvemIdListDefinitionFactoryService_GetTypeId = 'LIILDFSGTI08087',
    LitIvemIdListDefinitionFactoryService_UnsupportedTypeId = 'LIILDFSUTI08087',
    JsonRankedLitIvemIdListDefinition_IdResult = 'JRLIILDIR45609',
    JsonRankedLitIvemIdListDefinition_JsonLitIvemIdsNotSpecified = 'JRLIIDJLIINS5609',
    JsonRankedLitIvemIdListDefinition_JsonLitIvemIdsIsInvalid = 'JRLIIDJLIIII45609',
    JsonRankedLitIvemIdListDefinition_IdIsInvalid = 'JRLIIDIII45610',
    JsonRankedLitIvemIdListDefinition_JsonLitIvemIdIsInvalid = 'JRLIIDJLIIII45610',
    JsonRankedLitIvemIdListDefinition_JsonLitIvemIdArrayIsInvalid = 'JRLIIDJLIIAII45610',
    ScanMatchesLitIvemIdList_TryLock = 'SCLIILTL50098',
    ScanMatchesLitIvemIdList_ScanIdNotFound = 'SCLIILSINF50098',
    ScanMatchesLitIvemIdListDefinition_IdIsInvalid = 'SCLIILDIII50098',
    ScanMatchesLitIvemIdListDefinition_ScanIdIsInvalid = 'SCLIILDSIII50098',
    WatchmakerScoredRankLitIvemIdList_TryLock = 'WSRLIILTL50098',
    WatchmakerScoredRankLitIvemIdList_ScanIdNotFound = 'WSRLIILSINF50098',
    RankedLitIvemIdListReferential_LockListError = 'RLIILRLLE30681',
    GridLayoutOrReference_TryLockGridLayoutDefinition = 'GLORTLGSD66334',
    GridLayoutOrReference_LockReference = 'GLORLR66334',
    GridLayoutOrReference_ReferenceNotFound = 'GLORNF66334',
    GridLayoutDefinitionOrReference_GridLayoutDefinitionIsInvalid = 'GLDORGSDII66334',
    GridLayoutDefinitionOrReference_BothDefinitionAndReferenceAreNotSpecified = 'GLDORBDARANS66334',
    GridLayoutDefinition_ColumnsElementNotSpecified = 'GLDCENS10883',
    GridLayoutDefinition_TryCreateFromJsonColumns = 'GLDTCFJC10883',
    ReferenceableGridLayoutDefinition_JsonId = 'RGLDJI10883',
    ReferenceableGridLayoutDefinition_JsonName = 'RGLDJN10883',
    ReferenceableGridLayoutDefinition_JsonColumns = 'RGLDJC10883',
    GridLayoutDefinitionOrReferenceFactoryService_IsReferenceNotSpecified = 'GLDORFSIRNS55509',
    CallPutFromUnderlyingTableRecordSourceDefinition_UnderlyingIvemIdNotSpecified = 'CPFUTRSDUIINS21245',
    CallPutFromUnderlyingTableRecordSourceDefinition_UnderlyingIvemIdIsInvalid = 'CPFUTRSDUIIIIS21245',
    RankedLitIvemIdListTableRecordSource_TryLock = 'LIIFLTRSTL54339',
    RankedLitIvemIdListTableRecordSourceDefinition_DefinitionElementNotSpecified = 'RLIILTRSDDENS54339',
    RankedLitIvemIdListTableRecordSourceDefinition_DefinitionOrNamedExplicitReferenceIsInvalid = 'RLIILTRSDDONERII54339',
    RankedLitIvemIdListTableRecordSourceDefinition_DefinitionJsonIsInvalid = 'RLIILTRSDJII12209',
    LitIvemDetailsFromSearchSymbolsTableRecordSourceDefinition_RequestNotSpecified = 'LIDFSSTRSDRNS10198',
    LitIvemDetailsFromSearchSymbolsTableRecordSourceDefinition_DataDefinitionCreateError = 'LIDFSSTRSDSSDDCE10198',
    TableFieldSourceDefinition_DecodeCommaTextFieldNameNot2Elements = 'TFSDDCTFNN2E45009',
    TableFieldSourceDefinition_DecodeCommaTextFieldNameUnknownSourceId = 'TFSDDCTFNUSI45009',
    TableRecordSourceDefinition_TypeIdNotSpecified = 'TRSDTINS67689',
    TableRecordSourceDefinition_TypeIdIsUnknown = 'TRSDTIIU67689',
    PromisedLitIvemBaseDetailFromLitIvemIdListTableRecordSourceDefinition_JsonLitIvemIdsNotSpecified = 'PLIBDFLIILTRSDJLIINS60330',
    PromisedLitIvemBaseDetailFromLitIvemIdListTableRecordSourceDefinition_JsonLitIvemIdsIsInvalid = 'PLIBDFLIILTRSDJLIIII60330',
    PromisedLitIvemBaseDetailFromLitIvemIdListTableRecordSourceDefinition_JsonLitIvemIdArrayIsInvalid = 'PLIBDFLIILTRSDJLIIAII60330',
    TableRecordSourceDefinitionFactoryService_TryCreateFromJson_TypeId = 'TRSDFSTCFJTI91118',
    TableRecordSourceDefinitionFactoryService_TryCreateFromJson_Definition = 'TRSDFSTCFJD91118',
    TableRecordSourceDefinitionFactoryService_CreatePromisedLitIvemBaseDetailFromLitIvemIdListTableRecordSourceDefinition = 'TRSDFSCPLIBDFLIILTRSD9118',
    TopShareholderTableRecordSourceDefinition_LitIvemIdNotSpecified = 'TSTRSDLIINS66774',
    TopShareholderTableRecordSourceDefinition_CreateParametersError = 'TSTRSDCPE66774',
    GridSourceDefinition_LockLayout = 'GSDLL30899',
    GridSourceDefinition_TableRecordSourceDefinitionNotSpecified = 'GSDTRSDNS30899',
    GridSourceDefinition_TableRecordSourceDefinitionIsInvalid = 'GSDTRSDII30899',
    GridSourceDefinition_JsonGridLayoutDefinitionOrReference = 'GSDJGLDOR30899',
    GridSourceDefinition_GridLayoutOrReferenceDefinitionIsInvalid = 'GSDGLORDII30899',
    ReferenceableGridSourceDefinition_IdNotSpecified = 'RGSDINS30899',
    ReferenceableGridSourceDefinition_NameNotSpecified = 'RGSDNNS30899',
    ReferenceableGridSourceDefinition_TableRecordSourceDefinition = 'RGSDTRSD30899',
    GridSourceOrReferenceDefinition_GridSourceDefinitionIsInvalid = 'GSORDGSDII66334',
    GridSourceOrReferenceDefinition_BothDefinitionAndReferenceAreNotSpecified = 'GSORDBDARANS66334',
    GridSource_TryLockTableRecordSource = 'GSTLTRS10885',
    GridSource_TryLockGridLayout = 'GSTLGL10885',
    GridSourceOrReference_LockGridSource = 'GSORLGS66334',
    GridSourceOrReference_LockReferenceable = 'GSORLNR66334',
    GridSourceOrReference_ReferenceableNotFound = 'GSORNNF66334',
    SettingGroup_ElementMissingName = 'SGEMN20516',
    SettingGroup_ElementMissingTypeId = 'SGEMTI20516',
    SettingGroup_ElementHasUnsupportedTypeId = 'SGEHUTI20516',
    MatchesDataItem_AddChangeKeyAlreadyExists = 'MDIACKAE55575',
    MatchesDataItem_UpdateChangeKeyDoesNotExists = 'MDIUCKDNE55575',
    MatchesDataItem_RemoveChangeKeyDoesNotExists = 'MDIRCKDNE55575',
    BADICAN402991273 = 'BADICAN402991273',
    BADICAFI009922349 = 'BADICAFI009922349',
    BADICAFTF0109922349 = 'BADICAFTF0109922349',
    HU0882468723 = 'HU0882468723',
    OU09882468723 = 'OU09882468723',
    ZCEETIP122995 = 'ZCEETIP122995',
    ZCEETIU1221197 = 'ZCEETIU1221197',
    ZCEMTIP2244995 = 'ZCEMTIP2244995',
    ZCEMTIU5511197 = 'ZCEMTIU5511197',
    ZCE32810141442 = '32810141442',
    ZCEMCMA77553 = 'ZCEMCMA77553',
    ZCEMCMIASXTM21199 = 'ZCEMCMIASXTM21199',
    ZCEMCMIASXVM21199 = 'ZCEMCMIASXVM21199',
    ZCE34510141655 = '34510141655',
    ZCEMCMCD22779 = 'ZCEMCMCD22779',
    ZCE36110141722 = '36110141722',
    ZCEMCMN88543 = 'ZCEMCMN88543',
    ZCE36710142024 = '36710142024',
    ZCEMCMZ55883 = 'ZCEMCMZ55883',
    ZCEMCMIMYXD392855 = 'ZCEMCMIMYXD392855',
    ZCEMCMIMYXN717155 = 'ZCEMCMIMYXN717155',
    ZCEMCMIMYXU12120098 = 'ZCEMCMIMYXU12120098',
    ZCE37710142108 = '37710142108',
    ZCE38211102847 = '38211102847',
    ZCE38010142051 = '38010142051',
    ZCEFND37710142108 = 'ZCEFND37710142108',
    ZCEFN2M38211102847 = 'ZCEFN2M38211102847',
    ZCEFN1M38010142051 = 'ZCEFN1M38010142051',
    ZCEMCMD98743 = 'ZCEMCMD98743',
    ZCEMBTIE54253399 = 'ZCEMBTIE54253399',
    ZCEMBTIV3779959 = 'ZCEMBTIV3779959',
    ZCEMCMBAD39971 = 'ZCEMCMBAD39971',
    ZCEMCMBCU11008 = 'ZCEMCMBCU11008',
    ZCEMCMBCD11136 = 'ZCEMCMBCD11136',
    ZCEMCMBP39394 = 'ZCEMCMBP39394',
    ZCEMCMBFN39394 = 'ZCEMCMBFN39394',
    ZCEMCMBD56569 = 'ZCEMCMBD56569',
    ZCEMPMMDM12953 = 'ZCEMPMMDM12953',
    ZCEMPMMDE34499 = 'ZCEMPMMDE34499',
    ZCEMPMMDF22733 = 'ZCEMPMMDF22733',
    ZCEMPMEOO88447 = 'ZCEMPMEOO88447',
    ZCEMPMEOE98166 = 'ZCEMPMEOE98166',
    ZCEMPMEOF77765 = 'ZCEMPMEOF77765',
    ZCEMPMECO55586 = 'ZCEMPMECO55586',
    ZCEMPMECE48883 = 'ZCEMPMECE48883',
    ZCEMPMECM133398 = 'ZCEMPMECM133398',
    ZCEMPMECM247766 = 'ZCEMPMECM247766',
    ZCEMPMECF11187 = 'ZCEMPMECF11187',
    ZCEMPMDFF37776 = 'ZCEMPMDFF37776',
    ZCFTACF874444934239 = 'ZCFTACF874444934239',
    ZCFTANU874444934239 = 'ZCFTANU874444934239',
    ZCFTASF874444934239 = 'ZCFTASF874444934239',
    ZCFETFTIE11104419948 = 'ZCFETFTIE11104419948',
    ZCFETFTIF11104419948 = 'ZCFETFTIF11104419948',
    ZCFENFTIU13104419948 = 'ZCFENFTIU13104419948',
    ZCMSMT9834447361 = 'ZCMSMT9834447361',
    ZCAPICM19948 = 'ZCAPICM19948',
    ZCTTDMCRA15392887209 = 'ZCTTDMCRA15392887209',
    ZCTTDMCRU15392887209 = 'ZCTTDMCRU15392887209',
    ZCTTDMCRI120033332434 = 'ZCTTDMCRI120033332434',
    ZenithTradingControllerAccountsAccountState_MissingId = 'ZCATDMAMI10588',
    ZCATDMA10588824494 = 'ZCATDMA10588824494',
    ZCHTDMHC99813380 = 'ZCHTDMHC99813380',
    ZCHTDMHR472999123 = 'ZCHTDMHR472999123',
    ZCHTDMHAU22920765 = 'ZCHTDMHAU22920765',
    ZCHTDMHD10000984 = 'ZCHTDMHD10000984',
    ZCHTHU1200199547792 = 'ZCHTHU1200199547792',
    ZCTTDMCRA3339929166 = 'ZCTTDMCRA3339929166',
    ZCTTDMCRU3339929166 = 'ZCTTDMCRU3339929166',
    ZCTTDMCRI2009009121 = 'ZCTTDMCRI2009009121',
    ZCTTATU5693483701 = 'ZCTTATU5693483701',
    ZCTTAMTT97728332 = 'ZCTTAMTT97728332',
    ZCTTAMTS97728332 = 'ZCTTAMTS97728332',
    ZCTTAMFTT97728332 = 'ZCTTAMFTT97728332',
    ZCTTAMFTS97728332 = 'ZCTTAMFTS97728332',
    ACAOPMC298431 = 'ACAOPMC298431',
    ACAOPMT377521 = 'ACAOPMT377521',
    ACAOPMA23964 = 'ACAOPMA23964',
    ACAOPMD29984 = 'ACAOPMD29984',
    ACATPMC298431 = 'ACATPMC298431',
    ACATPMT377521 = 'ACATPMT377521',
    ACATPMA23964 = 'ACATPMA23964',
    ACATPMD29984 = 'ACATPMD29984',
    TCAPMT95883743 = 'TCAPMT95883743',
    TCAPMTP2998377 = 'TCAPMTP2998377',
    TCAPMTS2998377 = 'TCAPMTS2998377',
    ZOCTOU2243629458 = 'ZOCTOU2243629458',
    ZOCLOC1052883977 = 'ZOCLOC1052883977',
    ZOCLOU1052883977 = 'ZOCLOU1052883977',
    ZOCLODU87873991318 = 'ZOCLODU87873991318',
    AOMCPMC585822200 = 'AOMCPMC585822200',
    AOMCPMA333928660 = 'AOMCPMA333928660',
    AOMCPMT1009199929 = 'AOMCPMT1009199929',
    BMCPMC393833421 = 'BMCPMC393833421',
    BMCPMP9833333828 = 'BMCPMP9833333828',
    BMCPMS7744777737277 = 'BMCPMS7744777737277',
    COMCPMA6744444883 = 'COMCPMA6744444883',
    COMCPMA333928660 = 'COMCPMA333928660',
    COMCPMT1009199929 = 'COMCPMT1009199929',
    CHMCPMC588329999199 = 'CHMCPMC588329999199',
    CHMCPMA2233498 = 'CHMCPMA2233498',
    CHMCPMT2233498 = 'CHMCPMT2233498',
    CHMCPD87777354332 = 'CHMCPD87777354332',
    FMCPMC4433149989 = 'FMCPMC4433149989',
    FMCPMA5583200023 = 'FMCPMA5583200023',
    FMCPMT5583200023 = 'FMCPMT5583200023',
    FCFPM399285 = 'FCFPM399285',
    TCHPMC5838323333 = 'TCHPMC5838323333',
    TCHPMP68392967122 = 'TCHPMP68392967122',
    TCHPMS884352993242 = 'TCHPMS884352993242',
    MMCPMT95883743 = 'MMCPMT95883743',
    MMCPMTP2998377 = 'MMCPMTP2998377',
    MMCPMTS2998377 = 'MMCPMTS2998377',
    MOMCPMA6744444883 = 'MOMCPMA6744444883',
    MOMCPMA333928660 = 'MOMCPMA333928660',
    MOMCPMT1009199929 = 'MOMCPMT1009199929',
    OSOMCPMA6744444883 = 'OSOMCPMA6744444883',
    OSOMCPMA333928660 = 'OSOMCPMA333928660',
    OSOMCPMT1009199929 = 'OSOMCPMT1009199929',
    TCOPMC9923852488 = 'TCOPMC9923852488',
    TCOPMP555832222 = 'TCOPMP555832222',
    TCOPMS884352993242 = 'TCOPMS884352993242',
    TCOTCOPCRA9741 = 'TCOTCOPCRA9741',
    TCOTCOPCRO3232 = 'TCOTCOPCRO3232',
    POMCPMC4444838484 = 'POMCPMC4444838484',
    POMCPMA883771277577 = 'POMCPMA883771277577',
    POMCPMT2323992323 = 'POMCPMT2323992323',
    QCMCPMA788853223 = 'QCMCPMA788853223',
    QCMCPMT10053584222 = 'QCMCPMT10053584222',
    ZCQCTAA7744510945348 = 'ZCQCTAA7744510945348',
    ZCQCTAS7744510945348 = 'ZCQCTAS7744510945348',
    SMCPMC699483333434 = 'SMCPMC699483333434',
    SMCPMP11995543833 = 'SMCPMP11995543833',
    SMCPMS55845845454 = 'SMCPMS55845845454',
    SICAPMT95883743 = 'SICAPMT95883743',
    SISOMCPMA333928660 = 'SISOMCPMA333928660',
    SISOMCPMT1009199929 = 'SISOMCPMT1009199929',
    SMCPMC588329999199 = 'SMCPMC588329999199',
    SMCPMD558382000 = 'SMCPMD558382000',
    SMCPMP5885239991 = 'SMCPMP5885239991',
    SMCPMS6969222311 = 'SMCPMS6969222311',
    SMCCUCFD1212943448 = 'SMCCUCFD1212943448',
    SMCCACFFD121243448 = 'SMCCACFFD121243448',
    TMCPMC2019942466 = 'TMCPMC2019942466',
    TMCPMP9333857676 = 'TMCPMP9333857676',
    TMCPMS1102993424 = 'TMCPMS1102993424',
    TSMCPMA6744444883 = 'TSMCPMA6744444883',
    TSMCPMA333928660 = 'TSMCPMA333928660',
    TSMCPMT1009199929 = 'TSMCPMT1009199929',
    TMCPMC588329999199 = 'TMCPMC588329999199',
    TMCPMP5885239991 = 'TMCPMP5885239991',
    TMCPMS6969222311 = 'TMCPMS6969222311',
    ZPSMPPM2994344434 = 'ZPSMPPM2994344434',
    ZPSMPPM23230917111 = 'ZPSMPPM23230917111',
    SDIRR119119887772 = 'SDIRR119119887772',
    SDIUR119119887772 = 'SDIUR119119887772',
    SSSMSE19774 = 'MotifServices',
    CSL23230003998 = 'CSL23230003998',
    CSEPJDDU97222185554 = 'CSEPJDDU97222185554',
    CSLEPJDDEIU2248883843 = 'CSLEPJDDEIU2248883843',
    CSLEPJDDEIU2248883844 = "CSLEPJDDEIU2248883844",
    CSLEPOJDDEIU2248883845 = "CSLEPOJDDEIU2248883845",
    Config_MissingService = 'CMS97432',
    Config_ServiceMissingName = 'CSMN97432',
    Config_ServiceMissingOperator = 'CSMO97432',
    Config_ServiceInvalidOperator = 'CSIO97432',
    Config_MissingEnvironment = 'CME14886',
    Config_EnvironmentInvalidType = 'CEIT14886',
    Config_EnvironmentMissingDefaultData = 'CEMDD39006',
    Config_MissingExchange = 'CME67732',
    Config_MissingEndpoints = 'CME75229',
    Config_MissingOpenId = 'CMOI37760',
    CSEPJET9072322185564 = 'CSEPJET9072322185564',
    CSEPJOE9072322185564 = 'CSEPJOE9072322185564',
    CSEPPMSU00831852399 = 'CSEPPMSU00831852399',
    CSEPPMSL00831852399 = 'CSEPPMSL00831852399',
    CSEPPMSE00831852399 = 'CSEPPMSE00831852399',
    CSEPPZU00831852399 = 'CSEPPZU00831852399',
    CSEPPZL00831852399 = 'CSEPPZL00831852399',
    CSEPPZE00831852399 = 'CSEPPZE00831852399',
    CSOIPJA0831852399 = 'CSOIPJA0831852399',
    CSOIPJCI100194724 = 'CSOIPJCI100194724',
    CSOIPJCS988354312 = 'CSOIPJCS988354312',
    CSOIPJRU33448829 = 'CSOIPJRU33448829',
    CSOIPJSR12120987 = 'CSOIPJSR12120987',
    CSOIPJSC67773223 = 'CSOIPJSC67773223',
    CSDZLPJ788831131 = 'CSDZLPJ788831131',
    CSLTF1988871038839 = 'CSLTF1988871038839',
    CSLTV777333999 = 'CSLTV777333999',
    BABDIPDMAUC133330444 = 'BABDIPDMAUC133330444',
    BABDIPDMIAC13330444 = 'BABDIPDMIAC13330444',
    GLHFPGLCTNP34458 = 'GLHFPGLCTNP34458',
    GridLayoutColumnNotFoundForField = 'GLCNFFF95224',
    GridLayoutFieldDoesNotExist = 'GLFDNE95224',
    CommandContextNotRegistered = 'CCNR22996',
    CancellableNotFound = 'CNF22997',
    SymbolHasEmptyCode = 'SHEC50113',
    SymbolHasEmptyMarket = 'SHEM50113',
    ScanIdUpdated = 'SIU10668',
    WatchlistIdUpdated = 'WIU10668',

    /// Motif
    DitemComponent_ExtensionIdIsNotSpecified = 'DCEIINS20090',
    DitemComponent_ExtensionIdIsInvalid = 'DCEIII20090',
    DitemComponent_ComponentTypeNameIsNotSpecifiedOrInvalid = 'DCCTNINSOI20090',
    DitemComponent_ConstructionMethodNameIsNotSpecifiedOrInvalid = 'DCCMNINSOI20090',
    DitemComponent_ConstructionMethodNameIsUnknown = 'DCCMNIU20090',
    PlaceholderDitemFrameDefinition_DitemComponentIsNotSpecified = 'PDFDDCINS11133',
    PlaceholderDitemFrameDefinition_DitemComponentIsInvalid = 'PDFDDCII11133',
}
