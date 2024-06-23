import {PropertyValueType, typedArrayIncludes} from '@augment-vir/common';

/**
 * Only 4 gamepad keys because some browsers only support 4.
 *
 * @category Internal
 */
export const gamepadInputDeviceKey = {
    gamepad1: '0',
    gamepad2: '1',
    gamepad3: '2',
    gamepad4: '3',
} as const;

/**
 * All possible gamepad keys as a type.
 *
 * @category Internal
 */
export type GamepadInputDeviceKey = PropertyValueType<typeof gamepadInputDeviceKey>;
/**
 * Checks if the given number is within the range of gamepad device keys.
 *
 * @category Util
 */
export function isGamepadDeviceKey(input: string): input is GamepadInputDeviceKey {
    return typedArrayIncludes(Object.values(gamepadInputDeviceKey), input);
}

/**
 * Each supported non-gamepad device key. For now (and likely always), this means just keyboard and
 * mouse.
 *
 * @category Internal
 */
export const nonGamepadInputDeviceKey = {
    mouse: 'mouse',
    keyboard: 'keyboard',
} as const;
/**
 * Each supported non-gamepad device key as a type.
 *
 * @category Internal
 */
export type NonGamepadInputDeviceKey = PropertyValueType<typeof nonGamepadInputDeviceKey>;

/**
 * All possible input device keys: both gamepad and non-gamepad keys.
 *
 * @category Types
 */
export const inputDeviceKey = {
    ...nonGamepadInputDeviceKey,
    ...gamepadInputDeviceKey,
} as const;
/**
 * All possible input device keys as a type.
 *
 * @category Types
 */
export type InputDeviceKey = PropertyValueType<typeof inputDeviceKey>;
