import {getObjectTypedValues, isTruthy, mapObjectValues} from '@augment-vir/common';
import {gamepadToCurrentInputs} from './gamepad/read-gamepads';
import {GamepadMap} from './gamepad/serialized-gamepad';
import {GamepadDevice, KeyboardDevice, MouseDevice} from './input-device';
import {GamepadInputDeviceKey, inputDeviceKey} from './input-device-key';
import {InputDeviceType} from './input-device-type';
import {DeviceInputValue} from './input-value';

/**
 * All Gamepad Input Devices.
 *
 * @category Internal
 */
export type GamepadInputDevices = Record<GamepadInputDeviceKey, GamepadDevice>;

/**
 * All Input Devices handled by `InputDeviceHandler`.
 *
 * @category Types
 */
export type AllDevices = Partial<
    {
        [inputDeviceKey.mouse]: MouseDevice;
        [inputDeviceKey.keyboard]: KeyboardDevice;
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
        .map((inputDevice) => inputDevice?.currentInputs)
        .filter(isTruthy);
    const allInputValues: DeviceInputValue[][] = allInputValueMaps.map((inputValueMap) =>
        getObjectTypedValues(inputValueMap),
    );
    return allInputValues.flat();
}
