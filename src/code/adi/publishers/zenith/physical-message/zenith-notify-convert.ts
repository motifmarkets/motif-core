/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { AssertInternalError, Guid, UnreachableCaseError, parseIntStrict } from '../../../../sys/sys-internal-api';
import { LitIvemId, MarketId, ScanNotificationParameters, ScanTargetTypeId } from '../../../common/adi-common-internal-api';
import { ZenithProtocolCommon } from '../../../common/zenith-protocol/internal-api';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export namespace ZenithNotifyConvert {
    export namespace ScanType {
        export function toId(value: ZenithProtocol.NotifyController.ScanType) {
            switch (value) {
                case ZenithProtocol.NotifyController.ScanType.MarketSearch: return ScanTargetTypeId.Markets;
                case ZenithProtocol.NotifyController.ScanType.MarketMonitor: return ScanTargetTypeId.Symbols;
                default:
                    throw new UnreachableCaseError('ZNCSTTI20008', value);
            }
        }

        export function fromId(value: ScanTargetTypeId) {
            switch (value) {
                case ScanTargetTypeId.Markets: return ZenithProtocol.NotifyController.ScanType.MarketSearch;
                case ScanTargetTypeId.Symbols: return ZenithProtocol.NotifyController.ScanType.MarketMonitor;
                default:
                    throw new UnreachableCaseError('ZNCSTFI20008', value);
            }
        }
    }

    export namespace Target {
        export function toLitIvemIds(symbols: readonly ZenithProtocol.NotifyController.TargetSymbol[]): LitIvemId[] {
            return ZenithConvert.Symbol.toIdArray(symbols);
        }

        export function toMarketIds(markets: readonly ZenithProtocol.NotifyController.TargetMarket[]): MarketId[] {
            const count = markets.length;
            const result = new Array<MarketId>(count);
            for (let i = 0; i < count; i++) {
                const market = markets[i];
                const environmentedMarketId = ZenithConvert.EnvironmentedMarket.toId(market);
                result[i] = environmentedMarketId.marketId;
            }
            return result;
        }

        export function fromId(
            typeId: ScanTargetTypeId,
            targets: readonly MarketId[] | readonly LitIvemId[],
        ): string[] {
            switch (typeId) {
                case ScanTargetTypeId.Symbols: {
                    const targetLitIvemIds = targets as readonly LitIvemId[];
                    if (targetLitIvemIds.length === 0) {
                        return [];
                    } else {
                        if (typeof targetLitIvemIds[0] !== 'object') {
                            throw new AssertInternalError('ZNCTFISO44711');
                        } else {
                            return ZenithConvert.Symbol.fromIdArray(targetLitIvemIds);
                        }
                    }
                }
                case ScanTargetTypeId.Markets: {
                    const targetMarketIds = targets as readonly MarketId[];
                    const count = targetMarketIds.length;
                    if (count === 0) {
                        return [];
                    } else {
                        if (typeof targetMarketIds[0] !== 'number') {
                            throw new AssertInternalError('ZNCTFIMN44711');
                        } else {
                            const zenithMarkets = new Array<string>(count);
                            for (let i = 0; i < count; i++) {
                                const marketId = targetMarketIds[i];
                                zenithMarkets[i] = ZenithConvert.EnvironmentedMarket.fromId(marketId);
                            }
                            return zenithMarkets;
                        }
                    }
                }
                default:
                    throw new UnreachableCaseError('ZNCTFITU53339', typeId);
            }
        }
    }

    export namespace NotificationParameters {
        export function from(value: ScanNotificationParameters[]): ZenithProtocol.NotifyController.ScanParameters.Notification[] {
            const count = value.length;
            const result = new Array<ZenithProtocol.NotifyController.ScanParameters.Notification>(count);
            for (let i = 0; i < count; i++) {
                const valueElement = value[i];
                const valueMinimumElapsed = valueElement.minimumElapsed;
                const valueMinimumStable = valueElement.minimumStable;
                const minimumElapsed = valueMinimumElapsed === undefined ? undefined : ZenithConvert.Time.fromTimeSpan(valueMinimumElapsed);
                const minimumStable = valueMinimumStable === undefined ? undefined : ZenithConvert.Time.fromTimeSpan(valueMinimumStable);
                const resultElement: ZenithProtocol.NotifyController.ScanParameters.Notification = {
                    ChannelID: valueElement.channelId,
                    CultureCode: valueElement.cultureCode,
                    MinimumElapsed: minimumElapsed,
                    MinimumStable: minimumStable,
                    Settings: 
                }
            }
        }

        export function to(value: ZenithProtocol.NotifyController.ScanParameters.Notification[]): ScanNotificationParameters[] {
        }
    }

    export interface ScanMetadata {
        readonly versionNumber: number | undefined;
        readonly versionId: string | undefined;
        readonly versioningInterrupted: boolean;
        readonly lastSavedTime: Date | undefined;
        readonly lastEditSessionId: Guid | undefined;
        readonly symbolListEnabled: boolean | undefined;
        readonly zenithCriteriaSource: string | undefined;
        readonly zenithRankSource: string | undefined;
    }

    export namespace ScanMetaType {
        export function from(value: ScanMetadata): ZenithProtocolCommon.UserMetadata {
            const versionNumber = value.versionNumber;
            if (versionNumber === undefined) {
                throw new AssertInternalError('ZNCSMTFVN44498');
            } else {
                const versionId = value.versionId;
                if (versionId === undefined) {
                    throw new AssertInternalError('ZNCSMTFVI44498');
                } else {
                    const lastSavedTime = value.lastSavedTime;
                    if (lastSavedTime === undefined) {
                        throw new AssertInternalError('ZNCSMTFLST44498');
                    } else {
                        const lastEditSessionId = value.lastEditSessionId;
                        if (lastEditSessionId === undefined) {
                            throw new AssertInternalError('ZNCSMTFLESI44498');
                        } else {
                            const symbolListEnabled = value.symbolListEnabled;
                            if (symbolListEnabled === undefined) {
                                throw new AssertInternalError('ZNCSMTFSLE44498');
                            } else {
                                return {
                                    versionId,
                                    versioningInterrupted: value.versioningInterrupted ? 'true' : 'false',
                                    lastSavedTime: ZenithConvert.Date.DateTimeIso8601.fromDate(lastSavedTime),
                                    lastEditSessionId: lastEditSessionId,
                                    symbolListEnabled: symbolListEnabled ? 'true' : 'false',
                                    zenithCriteriaSource: value.zenithCriteriaSource,
                                    zenithRankSource: value.zenithRankSource,
                                }
                            }
                        }
                    }
                }
            }
        }

        export function to(value: ZenithProtocolCommon.UserMetadata): ScanMetadata {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            const versionNumberAsString = value['versionNumber'];
            const versionNumber = versionNumberAsString === undefined ? undefined : parseIntStrict(versionNumberAsString);
            const versionId = value['versionId'];
            const versioningInterruptedAsString: string | undefined  = value['versioningInterrupted'];
            const versioningInterrupted = versioningInterruptedAsString === undefined || versioningInterruptedAsString.toUpperCase() !== 'FALSE';
            const lastSavedTimeAsString = value['lastSavedTime'];
            const lastEditSessionId = value['lastEditSessionId'];
            const symbolListEnabledAsString = value['symbolListEnabled'];
            const symbolListEnabled = symbolListEnabledAsString === undefined ? undefined : symbolListEnabledAsString.toUpperCase() === 'TRUE';
            const zenithCriteriaSource = value['zenithCriteriaSource'];
            const zenithRankSource = value['zenithRankSource'];
            let lastSavedTime: Date | undefined;
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (lastSavedTimeAsString === undefined) {
                lastSavedTime = undefined;
            } else {
                const lastSavedTimeAsSourceTzOffsetDateTime = ZenithConvert.Date.DateTimeIso8601.toSourceTzOffsetDateTime(lastSavedTimeAsString);
                if (lastSavedTimeAsSourceTzOffsetDateTime === undefined) {
                    lastSavedTime = undefined;
                } else {
                    lastSavedTime = lastSavedTimeAsSourceTzOffsetDateTime.utcDate;
                }
            }
            return {
                versionNumber,
                versionId,
                versioningInterrupted,
                lastSavedTime,
                lastEditSessionId,
                symbolListEnabled,
                zenithCriteriaSource,
                zenithRankSource,
            }
        }
    }
}
