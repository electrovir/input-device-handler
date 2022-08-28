import {getObjectTypedValues, mapObject} from 'augment-vir';
import {keyboardDeviceKeySymbol, mouseDeviceKeySymbol} from './device-id';
import {gamepadToCurrentInputs} from './gamepad/read-gamepads';
import {GamepadMap} from './gamepad/serialized-gamepad';
import {GamepadInputDevice, KeyboardInputDevice, MouseInputDevice} from './input-device';
import {InputDeviceType} from './input-device-type';
import {DeviceInputValue} from './input-value';

export type GamepadInputDevices = Record<number, GamepadInputDevice>;

export type AllInputDevices = {
    [keyboardDeviceKeySymbol]: KeyboardInputDevice;
    [mouseDeviceKeySymbol]: MouseInputDevice;
} & GamepadInputDevices;

export function gamepadMapToInputDevices(gamepadMap: GamepadMap): GamepadInputDevices {
    return mapObject(gamepadMap, (index, gamepad): GamepadInputDevice => {
        return {
            currentInputs: gamepadToCurrentInputs(gamepad),
            deviceDetails: gamepad,
            deviceName: gamepad.id,
            deviceKey: gamepad.index,
            deviceType: InputDeviceType.Gamepad,
        };
    });
}

export function allInputDevicesToAllInputs(allInputDevices: AllInputDevices): DeviceInputValue[] {
    const allInputValueMaps: Record<string, DeviceInputValue>[] = getObjectTypedValues(
        allInputDevices,
    ).map((inputDevice) => inputDevice.currentInputs);
    const allInputValues: DeviceInputValue[][] = allInputValueMaps.map((inputValueMap) =>
        getObjectTypedValues(inputValueMap),
    );
    return allInputValues.flat();
}
