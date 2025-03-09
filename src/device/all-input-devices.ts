import {check} from '@augment-vir/assert';
import {getObjectTypedValues, mapObjectValues} from '@augment-vir/common';
import {gamepadToCurrentInputs} from './gamepad/read-gamepads.js';
import {GamepadMap} from './gamepad/serialized-gamepad.js';
import {GamepadInputDeviceKey, InputDeviceKey} from './input-device-key.js';
import {InputDeviceType} from './input-device-type.js';
import {GamepadDevice, KeyboardDevice, MouseDevice} from './input-device.js';
import {DeviceInputValue} from './input-value.js';

/**
 * All Gamepad Input Devices.
 *
 * @category Internal
 */
export type GamepadInputDevices = Partial<Record<GamepadInputDeviceKey, GamepadDevice>>;

/**
 * All Input Devices handled by `InputDeviceHandler`.
 *
 * @category Types
 */
export type AllDevices = Partial<
    {
        [InputDeviceKey.Mouse]: MouseDevice;
        [InputDeviceKey.Keyboard]: KeyboardDevice;
    } & GamepadInputDevices
>;

/**
 * Wraps all serialized gamepads into input device objects.
 *
 * @category Internal
 */
export function gamepadMapToInputDevices(gamepadMap: Readonly<GamepadMap>): GamepadInputDevices {
    return mapObjectValues(gamepadMap, (index, gamepad): GamepadDevice => {
        return {
            currentInputs: gamepadToCurrentInputs(gamepad),
            deviceDetails: gamepad,
            deviceName: gamepad.gamepadName,
            deviceKey: gamepad.deviceKey,
            deviceType: InputDeviceType.Gamepad,
        };
    });
}

/**
 * Reads all current inputs from all input devices.
 *
 * @category Internal
 */
export function allInputDevicesToAllInputs(
    allInputDevices: Readonly<AllDevices>,
): DeviceInputValue[] {
    const allInputValueMaps: Record<string, DeviceInputValue>[] = getObjectTypedValues(
        allInputDevices,
    )
        .map((inputDevice) => inputDevice.currentInputs)
        .filter(check.isTruthy);
    const allInputValues: DeviceInputValue[][] = allInputValueMaps.map((inputValueMap) =>
        getObjectTypedValues(inputValueMap),
    );
    return allInputValues.flat();
}
