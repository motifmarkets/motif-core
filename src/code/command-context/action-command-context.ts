/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { Command } from '../command/command-internal-api';
import { StringId } from '../res/res-internal-api';
import { ExtensionHandle } from '../sys/sys-internal-api';
import { CommandUiAction, UiAction } from '../ui-action/ui-action-internal-api';

export class ActionCommandContext {
    private readonly _actions = new Array<CommandUiAction>();

    constructor (
        public readonly id: ActionCommandContext.Id,
        public readonly displayId: StringId,
        public readonly htmlElement: HTMLElement,
        private readonly _multipleActionsResolveEventer: ActionCommandContext.MultipleActionsResolveEventer,
        private readonly _inheritedContext?: ActionCommandContext,
    ) {

    }

    addAction(action: CommandUiAction) {
        if (!this._actions.includes(action)) {
            this._actions.push(action);
        }
    }

    removeAction(action: CommandUiAction) {
        const index = this._actions.indexOf(action);
        if (index >= 0) {
            this._actions.splice(index, 1);
        }
    }

    resolveContextualCommandsToAction(contextualCommands: readonly ActionCommandContext.ContextualCommand[]) {
        const maxCount = contextualCommands.length
        const enabledActions = new Array<CommandUiAction>(maxCount);
        let aDisabledAction: CommandUiAction | undefined;
        let count = 0;

        for (const contextualCommand of contextualCommands) {
            const action = this.resolveContextualCommandToAction(contextualCommand);
            if (action !== undefined) {
                if (action.stateId === UiAction.StateId.Disabled) {
                    aDisabledAction = action;
                } else {
                    enabledActions[count++] = action;
                }
            }
        }

        switch (count) {
            case 0: return aDisabledAction; // if we only found disabled actions, then return one disabled action so that not propagated
            case 1: return enabledActions[0];
            default: {
                enabledActions.length = count;

                return this._multipleActionsResolveEventer(enabledActions);
            }
        }
    }

    resolveContextualCommandToAction(contextualCommand: ActionCommandContext.ContextualCommand) {
        let action: CommandUiAction | undefined;
        if (ActionCommandContext.Id.isEqual(contextualCommand.contextId, this.id)) {
            action = this.findAction(contextualCommand);
        } else {
            if (this._inheritedContext !== undefined) {
                action = this._inheritedContext.resolveContextualCommandToAction(contextualCommand);
            } else {
                action = undefined;
            }
        }

        return action;
    }

    private findAction(command: Command) {
        for (const action of this._actions) {
            if (action.command === command) {
                return action;
            }
        }

        return undefined;
    }
}

export namespace ActionCommandContext {
    export type MultipleActionsResolveEventer = (this: void, actions: CommandUiAction[]) => CommandUiAction | undefined;

    export interface Id {
        readonly extensionHandle: ExtensionHandle;
        readonly name: string;
    }

    export namespace Id {
        export function isEqual(left: Id, right: Id) {
            return left.name === right.name && left.extensionHandle === right.extensionHandle;
        }
    }

    export interface ContextualCommand extends Command {
        contextId: Id
    }

    export namespace ContextualCommand {
        export function isKeyEqual(left: ContextualCommand, right: ContextualCommand) {
            return Command.isKeyEqual(left, right) && Id.isEqual(left.contextId, right.contextId);
        }
    }
}
