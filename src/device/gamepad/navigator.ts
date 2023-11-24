import {typedHasProperty} from '@augment-vir/common';
import {SerializedGamepad, serializeGamepad} from './serialized-gamepad';
/** Wrapper for the global navigator object that takes into account browser discrepancies. */

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

export interface OldWebkitNavigator extends Omit<Navigator, 'getGamepads'> {
    webkitGetGamepads(): GamepadList;
}

/** Includes different navigator types to support different browsers */
const globalNavigator: OldWebkitNavigator | ChromeNavigator | Navigator = window.navigator;

export function getSerializedGamepads(): SerializedGamepad[] {
    return Array.from(
        typedHasProperty(globalNavigator, 'webkitGetGamepads')
            ? globalNavigator.webkitGetGamepads()
            : typedHasProperty(globalNavigator, 'getGamepads')
              ? globalNavigator.getGamepads()
              : [],
    )
        .filter((gamepad): gamepad is Gamepad => !!gamepad)
        .map((gamepad) => serializeGamepad(gamepad));
}
