import { OrderInstructionId } from './common/adi-common-internal-api';

export namespace ExchangeConst {
    export namespace Myx {
        export namespace InstructionIds {
            export const ProprietaryShortSell = [OrderInstructionId.PSS];
            export const IntraDayShortSell = [OrderInstructionId.IDSS];
            export const ProprietaryDayTrade = [OrderInstructionId.PDT];
            export const RegulatedShortSell = [OrderInstructionId.RSS];
        }
    }
}
