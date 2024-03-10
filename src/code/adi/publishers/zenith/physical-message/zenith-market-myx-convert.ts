/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { logger, parseIntStrict, parseNumberStrict, UnreachableCaseError } from '../../../../sys/internal-api';
import { LitIvemAlternateCodes, ZenithProtocolCommon } from '../../../common/adi-common-internal-api';
import { MyxLitIvemAttributes } from '../../../common/myx-lit-ivem-attributes';
import { ZenithMarketMyx } from './zenith-market-myx';

export namespace ZenithMarketMyxConvert {
    export namespace Symbols {
        export namespace Attributes {
            export function toLitIvem(value: ZenithProtocolCommon.Symbol.Attributes) {
                const detailAttributes = value as ZenithMarketMyx.MarketController.Symbols.Attributes;
                const keys = Object.keys(detailAttributes);
                const result = new MyxLitIvemAttributes();
                for (const key of keys) {
                    const attributeValue = detailAttributes[key];
                    parseAttribute(key, attributeValue, result);
                }

                return result;
            }

            function parseAttribute(key: string, value: string | undefined, result: MyxLitIvemAttributes) {
                if (value !== undefined) {
                    if (value === 'ISIN' || value === 'Ticker') {
                        return; // handle server bug - remove when fixed
                    } else {
                        const attributeKey = key as ZenithMarketMyx.MarketController.Symbols.KnownAttribute.Key;
                        switch (attributeKey) {
                            case ZenithProtocolCommon.Symbol.KnownAttributeKey.Category:
                                result.category = Category.toInteger(value);
                                break;
                            case ZenithProtocolCommon.Symbol.KnownAttributeKey.Class:
                                result.marketClassificationId = Class.toId(value);
                                break;
                            case ZenithProtocolCommon.Symbol.KnownAttributeKey.Sector:
                                result.sector = parseIntStrict(value);
                                break;
                            case ZenithProtocolCommon.Symbol.KnownAttributeKey.Short:
                                result.short = Short.toIdArray(value);
                                break;
                            case ZenithProtocolCommon.Symbol.KnownAttributeKey.ShortSuspended:
                                result.shortSuspended = Short.toIdArray(value);
                                break;
                            case ZenithProtocolCommon.Symbol.KnownAttributeKey.SubSector:
                                result.subSector = parseIntStrict(value);
                                break;
                            case ZenithProtocolCommon.Symbol.KnownAttributeKey.MaxRss:
                                result.maxRss = parseNumberStrict(value);
                                break;
                            case ZenithProtocolCommon.Symbol.KnownAttributeKey.Delivery:
                                result.deliveryBasisId = Delivery.toId(value);
                                break;
                            default: {
                                const unhandledKey: never = attributeKey;
                                logger.logDataError('ZMMCSAPA8777877723', `"${key}" "${unhandledKey as string}"`);
                                result.addUnrecognised(key, value);
                            }
                        }
                    }
                }
            }

            export namespace Category {
                export function toInteger(value: string) {
                    return parseIntStrict(value);
                }
            }

            export namespace Class {
                export function toId(value: string) {
                    const marketClassificationValue = value as ZenithMarketMyx.MarketController.Symbols.MarketClassification;
                    switch (marketClassificationValue) {
                        case ZenithMarketMyx.MarketController.Symbols.MarketClassification.Main:
                            return MyxLitIvemAttributes.MarketClassificationId.Main;
                        case ZenithMarketMyx.MarketController.Symbols.MarketClassification.Ace:
                            return MyxLitIvemAttributes.MarketClassificationId.Ace;
                        case ZenithMarketMyx.MarketController.Symbols.MarketClassification.Etf:
                            return MyxLitIvemAttributes.MarketClassificationId.Etf;
                        case ZenithMarketMyx.MarketController.Symbols.MarketClassification.Strw:
                            return MyxLitIvemAttributes.MarketClassificationId.Strw;
                        case ZenithMarketMyx.MarketController.Symbols.MarketClassification.Bond:
                            return MyxLitIvemAttributes.MarketClassificationId.Bond;
                        case ZenithMarketMyx.MarketController.Symbols.MarketClassification.Leap:
                            return MyxLitIvemAttributes.MarketClassificationId.Leap;
                        default: {
                            const neverValueIgnored: never = marketClassificationValue;
                            logger.logDataError('ZMMCSACLTI32238283382', `${value}`);
                            return undefined;
                        }
                    }
                }
            }

            export namespace Short {
                export function toIdArray(value: string) {
                    const count = value.length;
                    const result = new Array<MyxLitIvemAttributes.ShortSellTypeId>(count);
                    for (let i = 0; i < count; i++) {
                        result[i] = toId(value[i]);
                    }
                    return result;
                }

                export function toId(value: string) {
                    const shortValue = value as ZenithMarketMyx.MarketController.Symbols.ShortSellType;
                    switch (shortValue) {
                        case ZenithMarketMyx.MarketController.Symbols.ShortSellType.RegulatedShortSelling:
                            return MyxLitIvemAttributes.ShortSellTypeId.RegulatedShortSelling;
                        case ZenithMarketMyx.MarketController.Symbols.ShortSellType.ProprietaryDayTrading:
                            return MyxLitIvemAttributes.ShortSellTypeId.ProprietaryDayTrading;
                        case ZenithMarketMyx.MarketController.Symbols.ShortSellType.IntraDayShortSelling:
                            return MyxLitIvemAttributes.ShortSellTypeId.IntraDayShortSelling;
                        case ZenithMarketMyx.MarketController.Symbols.ShortSellType.ProprietaryShortSelling:
                            return MyxLitIvemAttributes.ShortSellTypeId.ProprietaryShortSelling;
                        default:
                            throw new UnreachableCaseError('ZMMCSACSTI3322382833382', shortValue);
                    }
                }
            }

            export namespace Delivery {
                export function toId(value: string) {
                    const deliveryBasisValue = value as ZenithMarketMyx.MarketController.Symbols.DeliveryBasis;
                    switch (deliveryBasisValue) {
                        case ZenithMarketMyx.MarketController.Symbols.DeliveryBasis.BuyingInT0:
                            return MyxLitIvemAttributes.DeliveryBasisId.BuyingInT0;
                        case ZenithMarketMyx.MarketController.Symbols.DeliveryBasis.DesignatedBasisT1:
                            return MyxLitIvemAttributes.DeliveryBasisId.DesignatedBasisT1;
                        case ZenithMarketMyx.MarketController.Symbols.DeliveryBasis.ReadyBasisT2:
                            return MyxLitIvemAttributes.DeliveryBasisId.ReadyBasisT2;
                        case ZenithMarketMyx.MarketController.Symbols.DeliveryBasis.ImmediateBasisT1:
                            return MyxLitIvemAttributes.DeliveryBasisId.ImmediateBasisT1;
                        default: {
                            const neverValueIgnored: never = deliveryBasisValue;
                            logger.logDataError('ZMMCSADTI133223828533382', `${value}`);
                            return undefined;
                        }
                    }
                }
            }
        }

        export namespace Alternates {
            export function toAdi(alternates: ZenithMarketMyx.MarketController.Symbols.Alternates) {
                const result: LitIvemAlternateCodes = {};

                for (const [key, entryValue] of Object.entries(alternates)) {
                    const value = entryValue as string;
                    switch (key) {
                        case ZenithProtocolCommon.Symbol.AlternateKey.Ticker: {
                            result.ticker = value;
                            break;
                        }
                        case ZenithProtocolCommon.Symbol.AlternateKey.Gics: {
                            result.gics = value;
                            break;
                        }
                        case ZenithProtocolCommon.Symbol.AlternateKey.Isin: {
                            result.isin = value;
                            break;
                        }
                        case ZenithProtocolCommon.Symbol.AlternateKey.Ric: {
                            result.ric = value;
                            break;
                        }
                        case ZenithProtocolCommon.Symbol.AlternateKey.Base: {
                            result.base = value;
                            break;
                        }
                        default:
                            result[key] = value;
                    }
                }
                return result;
            }
        }
    }
}
