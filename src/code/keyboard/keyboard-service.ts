/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { ActionCommandContext, CancelCommandContext } from '../command-context/command-context-internal-api';
import { Command } from '../command/command';
import { extStrings } from '../res/ext-strings';
import { ExtensionOrInternalError, ExternalError } from '../sys/external-error';
import { compareInteger, earliestBinarySearch, ModifierKey } from '../sys/sys-internal-api';
import { UiAction } from '../ui-action/ui-action-internal-api';
import { KeyboardShortcutRegistry } from './keyboard-shortcut-registry';

export class KeyboardService {
    private readonly _keyboardShortcutRegistry = new KeyboardShortcutRegistry();

    private readonly _registeredActionCommandContexts = new Array<KeyboardService.ActionCommandContextRegistration>();
    private readonly _registeredCancelCommandContexts = new Array<CancelCommandContext>();

    registerActionCommandContext(context: ActionCommandContext, root = false) {
        const registration: KeyboardService.ActionCommandContextRegistration = {
            context,
            keyboardEventListener: (event) => this.handleKeydownEvent(event, registration),
            root,
        }

        this._registeredActionCommandContexts.push(registration);

        context.htmlElement.addEventListener('keydown', registration.keyboardEventListener);
    }

    deregisterCommandContext(context: ActionCommandContext) {
        const index = this._registeredActionCommandContexts.findIndex((registration) => registration.context === context);
        if (index < 0) {
            throw new ExtensionOrInternalError(
                ExternalError.Code.CommandContextNotRegistered,
                extStrings[context.id.extensionHandle][context.displayId]
            );
        } else {
            this._registeredActionCommandContexts.splice(index, 1);
        }
    }

    registerCancelContext(context: CancelCommandContext) {
        const searchResult = earliestBinarySearch(
            this._registeredCancelCommandContexts,
            context,
            (left, right) => compareInteger(left.priority, right.priority)
        );

        this._registeredCancelCommandContexts.splice(searchResult.index, 0, context);
    }

    deregisterCancelContext(context: CancelCommandContext) {
        const index = this._registeredCancelCommandContexts.indexOf(context);
        if (index < 0) {
            throw new ExtensionOrInternalError(ExternalError.Code.CommandContextNotRegistered, context.name);
        } else {
            this._registeredCancelCommandContexts.splice(index, 1);
        }
    }

    private handleKeydownEvent(event: KeyboardEvent, actionRegistration: KeyboardService.ActionCommandContextRegistration) {
        if (!this.tryProcessShortcut(event, actionRegistration)) {
            if (actionRegistration.root && event.key === 'Escape' && this._registeredCancelCommandContexts.length > 0) {
                const cancelCommandContext = this._registeredCancelCommandContexts[0];
                cancelCommandContext.execute()
            }

        }
    }

    private tryProcessShortcut(event: KeyboardEvent, registration: KeyboardService.ActionCommandContextRegistration) {
        const modifierKeys = ModifierKey.IdSet.create(event.altKey, event.ctrlKey, event.metaKey, event.shiftKey);
        const shortcut: Command.KeyboardShortcut = {
            key: event.key,
            modifierKeys,
        };

        const contextualCommands = this._keyboardShortcutRegistry.findCommands(shortcut);
        const commandCount = contextualCommands.length;
        if (commandCount > 0) {
            const context = registration.context;
            const action = context.resolveContextualCommandsToAction(contextualCommands);
            if (action !== undefined) {
                event.stopPropagation();
                event.preventDefault();
                if (action.stateId !== UiAction.StateId.Disabled) {
                    action.signal(UiAction.SignalTypeId.KeyboardShortcut, modifierKeys);
                }
                return true;
            }
        }

        return false;
    }
}

export namespace KeyboardService {
    export type KeyboardEventListener = (event: KeyboardEvent) => void
    export interface ActionCommandContextRegistration {
        context: ActionCommandContext;
        keyboardEventListener: KeyboardEventListener;
        root: boolean;
    }
}
