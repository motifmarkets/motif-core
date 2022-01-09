import { AssertInternalError } from '../sys/internal-error';
import { ExchangeId, OrdersDataMessage, Side, SideId } from './common/adi-common-internal-api';
import { BidAskSideId, OrderInstructionId, OrderShortSellTypeId } from './common/data-types';
import { ExchangeConst } from './exchange-const';


export namespace OrderExtendedSide {
    export function calculateFromOrdersDataMessage(change: OrdersDataMessage.AddChange): SideId {
        return SideId.Buy;
    }

    export interface OrderSideAndShortSellTypeAndInstructions {
        readonly orderSideId: BidAskSideId;
        readonly shortSellTypeId: OrderShortSellTypeId | undefined;
        readonly instructionIds: OrderInstructionId[];
    }

    export function calculateOrderSideAndShortSellTypeAndInstructions(extendedSideId: SideId, exchangeId: ExchangeId) {
        const orderSideId = Side.idToBidAskSideId(extendedSideId);
        let shortSellTypeId: OrderShortSellTypeId | undefined;
        let instructionIds: OrderInstructionId[];
        if (!Side.idIsShortSell(extendedSideId)) {
            instructionIds = [];
        } else {
            switch (exchangeId) {
                case ExchangeId.Myx: {
                    shortSellTypeId = OrderShortSellTypeId.ShortSell;
                    switch (extendedSideId) {
                        case SideId.IntraDayShortSell: {
                            instructionIds = ExchangeConst.Myx.InstructionIds.IntraDayShortSell;
                            break;
                        }
                        case SideId.RegulatedShortSell: {
                            instructionIds = ExchangeConst.Myx.InstructionIds.RegulatedShortSell;
                            break;
                        }
                        case SideId.ProprietaryShortSell: {
                            instructionIds = ExchangeConst.Myx.InstructionIds.ProprietaryShortSell;
                            break;
                        }
                        case SideId.ProprietaryDayTrade: {
                            instructionIds = ExchangeConst.Myx.InstructionIds.ProprietaryDayTrade;
                            break;
                        }
                        default:
                            throw new AssertInternalError('OESCOSASSTAMYXI22244');
                    }
                    break;
                }
                default:
                    throw new AssertInternalError('OESCOSASSTADEFI22244');
            }
        }

        const result: OrderSideAndShortSellTypeAndInstructions = {
            orderSideId,
            shortSellTypeId,
            instructionIds,
        }

        return result;
    }
}
