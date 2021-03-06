/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { I18nStrings, StringId } from '../res/res-internal-api';
import { Logger } from './logger';
import { MotifError } from './motif-error';

/** @public */
export abstract class ExternalError extends MotifError {
    constructor(errorTypeDescription: StringId, private _code: ExternalError.Code, message?: string) {
        super(message === undefined || message === '' ?
            I18nStrings.getStringPlusEnglish(errorTypeDescription) + `: ${_code}`
            :
            I18nStrings.getStringPlusEnglish(errorTypeDescription) + `: ${_code}: ${message}`);
        Logger.logError(this.message, 120);
    }

    get code() { return this._code; }
}

/** @public */
export class GeneralExternalError extends ExternalError {
    constructor(code: ExternalError.Code, message: string) {
        super(StringId.ExternalError, code, message);
    }
}

/** @public */
export class JsonLoadError extends ExternalError {
    constructor(code: ExternalError.Code, message?: string) {
        super(StringId.JsonLoadExternalError, code, message);
    }
}

/** @public */
export class ConfigError extends ExternalError {
    constructor(code: ExternalError.Code, serviceName: string, message: string) {
        super(StringId.ConfigExternalError, code, `SvcName: "${serviceName}" Value: ${message.substr(0, 400)}`);
    }
}

/** @public */
export class DataError extends ExternalError {
    constructor(code: ExternalError.Code, message: string) {
        super(StringId.DataExternalError, code, message);
    }
}

/** @public */
export class FeedError extends ExternalError {
    constructor(code: ExternalError.Code, message: string) {
        super(StringId.FeedExternalError, code, message);
    }
}

/** @public */
export class BaseZenithDataError extends ExternalError {
    constructor(errorTypeDescription: StringId, code: ExternalError.Code, message: string) {
        super(errorTypeDescription, code, message);
    }
}

/** @public */
export class ZenithDataError extends BaseZenithDataError {
    constructor(code: ExternalError.Code, message: string) {
        super(StringId.ZenithDataExternalError, code, message);
    }
}

/** @public */
export class ZenithDataStateError extends BaseZenithDataError {
    constructor(code: ExternalError.Code, message: string) {
        super(StringId.ZenithDataStateExternalError, code, message);
    }
}

/** @public */
export class MotifServicesError extends ExternalError {
    constructor(code: ExternalError.Code, message?: string) {
        super(StringId.MotifServicesExternalError, code, message);
    }
}

/** @public */
export class ExtensionError extends ExternalError {
    constructor(code: ExternalError.Code, message?: string) {
        super(StringId.ExtensionExternalError, code, message);
    }
}

export class ExtensionOrInternalError extends ExternalError {
    constructor(code: ExternalError.Code, message?: string) {
        super(StringId.ExtensionOrInternalExternalError, code, message);
    }
}

/** @public */
export class GridLayoutError extends ExternalError {
    constructor(code: ExternalError.Code, message?: string) {
        super(StringId.GridLayoutExternalError, code, message);
    }
}

/** @public */
export namespace ExternalError {
    export const enum Code {
        SymbolsServiceParseModeJsonValueToId = 'SSPMJVTI',
        SymbolsServiceExchangeHideModeJsonValueToId = 'SSEHMJVTI',
        CallPutTableRecordDefinitionLoadFromJsonKeyUndefined = 'CPTRDLFJKU',
        CallPutTableRecordDefinitionLoadFromJsonKeyError = 'CPTRDLFJKE',
        TopShareholderTableRecordDefinitionLoadFromJsonKeyUndefined = 'TSTRDLFJKU',
        TopShareholderTableRecordDefinitionLoadFromJsonKeyError = 'TSTRDLFJKE',
        ExtensionsServiceIsEnabledHandleExtensionUndefined = 'ESIEHEU',
        ExtensionsServiceGetNameHandleExtensionUndefined = 'ESGNHEU',
        ExtensionsServiceGetPublisherHandleExtensionUndefined = 'ESGPNHEU',
        ExtensionsServiceAddDuplicateName = 'ESADN',
        ExtensionsServiceMismatchedExtensionInfo = 'ESMEI',
        ParseMotifServicesServiceGetResponsePayload = 'PMSSGRP',
        ParseMotifServicesServiceSetResponsePayload = 'PMSSSRP',
        ParseMotifServicesServiceDeleteResponsePayload = 'PMSSDRP',
        BADICAN402991273 = 'BADICAN402991273',
        BADICAC11119321436 = 'BADICAC11119321436',
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
        CSSPJN14499232322 = 'CSSPJN14499232322',
        CSEPJDDU97222185554 = 'CSEPJDDU97222185554',
        CSLEPJDDEIU2248883843 = 'CSLEPJDDEIU2248883843',
        CSLEPJDDEIU2248883844 = "CSLEPJDDEIU2248883844",
        CSLEPOJDDEIU2248883845 = "CSLEPOJDDEIU2248883845",
        ConfigMissingService = 'CMS97432',
        ConfigMissingEnvironment = 'CME14886',
        ConfigEnvironmentMissingDefaultData = 'CEMDD39006',
        ConfigMissingExchange = 'CME67732',
        ConfigMissingEndpoints = 'CME75229',
        ConfigMissingOpenId = 'CMOI37760',
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
    }
}
