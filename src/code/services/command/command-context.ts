/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { Command } from './command';

export class CommandContext {
    executeEvent: CommandContext.ExecuteEvent;

    private readonly _commands = new Array<Command>();
    private readonly _commandByShortcutMap = new Map<Command.KeyboardShortcut.MapKey, Command>();

    constructor (public readonly name: string, public readonly htmlElement: HTMLElement) {

    }

    addCommand(command: Command) {
        if (!this._commands.includes(command)) {
            this._commands.push(command);
        }
    }

    executeCommand(command: Command) {
        this.executeEvent(command);
    }
}

export namespace CommandContext {
    export type ExecuteEvent = (this: void, command: Command) => void;
}
