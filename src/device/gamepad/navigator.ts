import {typedHasProperty} from '@augment-vir/common';
import {AllGamepadDeadZoneSettings} from './dead-zone-settings';
import {SerializedGamepad, serializeGamepad} from './serialized-gamepad';
/** Wrapper for the global navigator object that takes into account browser discrepancies. */

/**
 * Fixed type for a list of Gamepads as read by the built-in browser Gamepad API.
 *
 * @category Internal
 */
export interface GamepadList extends Iterable<Gamepad> {
    0: Gamepad | null;
    1: Gamepad | null;
    2: Gamepad | null;
    3: Gamepad | null;
    length: 4;
}

/**
 * Chrome's specific implementation of the navigator's `getGamepads()`.
 *
 * @category Internal
 */
export interface ChromeNavigator extends Omit<Navigator, 'getGamepads'> {
    /** Gets the current gamepads. */
    getGamepads(): GamepadList;
}

/**
 * Webkit's old implementation of the navigator's `getGamepads()`.
 *
 * @category Internal
 */
export interface OldWebkitNavigator extends Omit<Navigator, 'getGamepads'> {
    /** Gets the current gamepads. */
    webkitGetGamepads(): GamepadList;
}

/** Includes different navigator types to support different browsers */
const globalNavigator: OldWebkitNavigator | ChromeNavigator | Navigator = window.navigator;

/**
 * Read all serialized gamepads from the browser's built-in Gamepad API.
 *
 * @category Internal
 */
export function getSerializedGamepads({
    deadZoneSettings,
    globalDeadZone,
}: Readonly<{
    deadZoneSettings: Readonly<AllGamepadDeadZoneSettings>;
    globalDeadZone: number;
}>): SerializedGamepad[] {
    return Array.from(
        typedHasProperty(globalNavigator, 'webkitGetGamepads')
            ? globalNavigator.webkitGetGamepads()
            : typedHasProperty(globalNavigator, 'getGamepads')
              ? globalNavigator.getGamepads()
              : [],
    )
        .filter((gamepad): gamepad is Gamepad => !!gamepad)
        .map((gamepad) => serializeGamepad({gamepad, deadZoneSettings, globalDeadZone}));
}
