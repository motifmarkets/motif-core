/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { ExtensionOrInternalError, ExternalError } from '../../sys/external-error';
import { CancelContext, CommandContext } from '../command/services-command-internal-api';

export class KeyboardService {
    private readonly _registeredCommandContexts = new Array<CommandContext>();

    registerCommandContext(context: CommandContext) {
        this._registeredCommandContexts.push(context);
    }

    deregisterCommandContext(context: CommandContext) {
        const index = this._registeredCommandContexts.indexOf(context);
        if (index < 0) {
            throw new ExtensionOrInternalError(ExternalError.Code.CommandContextNotRegistered, context.name);
        } else {
            this._registeredCommandContexts.splice(index, 1);
        }
    }

    registerCancelContext(context: CancelContext) {
        //
    }
}
