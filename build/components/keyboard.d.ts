/**
 * An encapsuled class to get keyboard key.
 */
declare class Keyboard {
    keys: Record<string, boolean>;
    constructor();
    listenForKey(): void;
    onKeyDown(e: KeyboardEvent): void;
    onKeyUp(e: KeyboardEvent): void;
    get isUpKeyDown(): boolean;
    get isDownKeyDown(): boolean;
    get isLeftKeyDown(): boolean;
    get isRightKeyDown(): boolean;
    get isSpaceKeyDown(): boolean;
    get isEnterKeyDown(): boolean;
    get isBackspaceKeyDown(): boolean;
    get isCtrlKeyDown(): boolean;
    get isShiftKeyDown(): boolean;
    get isTabKeyDown(): boolean;
    get isEscKeyDown(): boolean;
}
export { Keyboard };
