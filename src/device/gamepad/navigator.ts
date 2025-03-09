import {check} from '@augment-vir/assert';
import {arrayToObject} from '@augment-vir/common';
import type {GamepadInputDeviceKey} from '../input-device-key.js';
/** Wrapper for the global navigator object that takes into account browser discrepancies. */

/**
 * Fixed type for a list of Gamepads as read by the built-in browser Gamepad API.
 *
 * @category Internal
 */
interface GamepadList extends Iterable<Gamepad> {
    0: Gamepad | null;
    1: Gamepad | null;
    2: Gamepad | null;
    3: Gamepad | null;
    length: 4;
}

interface StandardNavigator extends Omit<Navigator, 'getGamepads'> {
    /** Gets the current gamepads. */
    getGamepads(): GamepadList;
}

interface OldWebkitNavigator extends Omit<Navigator, 'getGamepads'> {
    /** Gets the current gamepads. */
    webkitGetGamepads(): GamepadList;
}

/** Includes different navigator types to support different browsers */
const globalNavigator: OldWebkitNavigator | StandardNavigator | Navigator = window.navigator;

/**
 * Read all gamepads straight from the browser's built-in gamepad API, accounting for different
 * implementations of `window.navigator.getGamepads()`.
 *
 * @category Internal
 */
export function getGamepads(): Partial<Record<GamepadInputDeviceKey, Gamepad>> {
    return arrayToObject(
        Array.from(
            check.hasKey(globalNavigator, 'webkitGetGamepads')
                ? globalNavigator.webkitGetGamepads()
                : check.hasKey(globalNavigator, 'getGamepads')
                  ? globalNavigator.getGamepads()
                  : [],
        ),
        (value) => {
            if (!value) {
                return undefined;
            }

            return {
                key: value.index,
                value,
            };
        },
    );
}
