import {PropertyValueType, typedArrayIncludes} from '@augment-vir/common';

/**
 * Only 4 gamepad keys because some browsers only support 4.
 *
 * @category Internal
 */
export const GamepadInputDeviceKey = {
    Gamepad1: '0',
    Gamepad2: '1',
    Gamepad3: '2',
    Gamepad4: '3',
} as const;

/**
 * All possible gamepad keys as a type.
 *
 * @category Internal
 */
export type GamepadInputDeviceKey = PropertyValueType<typeof GamepadInputDeviceKey>;
/**
 * Checks if the given number is within the range of gamepad device keys.
 *
 * @category Util
 */
export function isGamepadDeviceKey(input: string): input is GamepadInputDeviceKey {
    return typedArrayIncludes(Object.values(GamepadInputDeviceKey), input);
}

/**
 * Each supported non-gamepad device key. For now (and likely always), this means just keyboard and
 * mouse.
 *
 * @category Internal
 */
export const NonGamepadInputDeviceKey = {
    Mouse: 'mouse',
    Keyboard: 'keyboard',
} as const;
/**
 * Each supported non-gamepad device key as a type.
 *
 * @category Internal
 */
export type NonGamepadInputDeviceKey = PropertyValueType<typeof NonGamepadInputDeviceKey>;

/**
 * All possible input device keys: both gamepad and non-gamepad keys.
 *
 * @category Types
 */
export const InputDeviceKey = {
    ...NonGamepadInputDeviceKey,
    ...GamepadInputDeviceKey,
} as const;
/**
 * All possible input device keys as a type.
 *
 * @category Types
 */
export type InputDeviceKey = PropertyValueType<typeof InputDeviceKey>;
