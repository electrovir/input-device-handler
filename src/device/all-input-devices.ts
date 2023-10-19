import {getObjectTypedValues, isTruthy, mapObjectValues} from '@augment-vir/common';
import {gamepadToCurrentInputs} from './gamepad/read-gamepads';
import {GamepadMap} from './gamepad/serialized-gamepad';
import {GamepadDevice, KeyboardDevice, MouseDevice} from './input-device';
import {GamepadInputDeviceKey, inputDeviceKey} from './input-device-key';
import {InputDeviceTypeEnum} from './input-device-type';
import {DeviceInputValue} from './input-value';

export type GamepadInputDevices = Partial<Record<GamepadInputDeviceKey, GamepadDevice>>;

export type AllDevices = {
    [inputDeviceKey.mouse]: MouseDevice;
    [inputDeviceKey.keyboard]: KeyboardDevice;
} & GamepadInputDevices;

export function gamepadMapToInputDevices(gamepadMap: GamepadMap): GamepadInputDevices {
    return mapObjectValues(gamepadMap, (index, gamepad): GamepadDevice => {
        return {
            currentInputs: gamepadToCurrentInputs(gamepad),
            deviceDetails: gamepad,
            deviceName: gamepad.id,
            deviceKey: gamepad.index,
            deviceType: InputDeviceTypeEnum.Gamepad,
        };
    });
}

export function allInputDevicesToAllInputs(allInputDevices: AllDevices): DeviceInputValue[] {
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
