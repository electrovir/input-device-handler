export interface GamepadList extends Iterable<Gamepad> {
    0: Gamepad | null;
    1: Gamepad | null;
    2: Gamepad | null;
    3: Gamepad | null;
    length: 4;
}

export interface ChromeNavigator extends Omit<Navigator, 'getGamepads'> {
    getGamepads(): GamepadList;
}

export interface OldChromeNavigator extends Omit<Navigator, 'getGamepads'> {
    webkitGetGamepads(): GamepadList;
}

/** Includes different navigator types to support different browsers */
export function getNavigator(): OldChromeNavigator | ChromeNavigator | Navigator {
    return window.navigator;
}
