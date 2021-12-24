/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

export class CancelCommandContext {
    constructor (
        public readonly name: string, // for error reporting only
        public readonly priority: CancelCommandContext.Priority,
        public readonly executeEventer: CancelCommandContext.ExecuteEventer,
    ) {
        // no code
    }

    execute() {
        this.executeEventer();
    }
}

export namespace CancelCommandContext {
    export type ExecuteEventer = (this: void) => void;

    export const enum Priority {
        Menu = 100,
        High = 1000,
        Low = 10000,
    }
}
