import {PropertyValueType} from '@augment-vir/common';

/** Only 4 gamepad keys because some browsers only support 4. */
export const gamepadInputDeviceKey = {
    gamepad1: 0,
    gamepad2: 1,
    gamepad3: 2,
    gamepad4: 3,
} as const;

export type GamepadInputDeviceKey = PropertyValueType<typeof gamepadInputDeviceKey>;

export function isGamepadDeviceKey(input: number): input is GamepadInputDeviceKey {
    return (Object.values(gamepadInputDeviceKey) as number[]).includes(input);
}

export const nonGamepadInputDeviceKey = {
    mouse: 'mouse',
    keyboard: 'keyboard',
} as const;

export type NonGamepadInputDeviceKey = PropertyValueType<typeof nonGamepadInputDeviceKey>;

export const inputDeviceKey = {
    ...nonGamepadInputDeviceKey,
    ...gamepadInputDeviceKey,
} as const;

export type AnyInputDeviceKey = PropertyValueType<typeof inputDeviceKey>;
