import {getObjectTypedValues, mapObject} from 'augment-vir';
import {keyboardDeviceIdSymbol, mouseDeviceIdSymbol} from './device-id';
import {DeviceInputValue} from './device-input';
import {gamepadToCurrentInputs} from './gamepad/read-gamepads';
import {GamepadMap} from './gamepad/serialized-gamepad';
import {GamepadInputDevice, KeyboardInputDevice, MouseInputDevice} from './input-device';
import {InputDeviceType} from './input-device-type';

export type GamepadInputDevices = Record<number, GamepadInputDevice>;

export type AllInputDevices = {
    [keyboardDeviceIdSymbol]: KeyboardInputDevice;
    [mouseDeviceIdSymbol]: MouseInputDevice;
} & GamepadInputDevices;

export function gamepadMapToInputDevices(gamepadMap: GamepadMap): GamepadInputDevices {
    return mapObject(gamepadMap, (index, gamepad): GamepadInputDevice => {
        return {
            currentInputs: gamepadToCurrentInputs(gamepad),
            deviceDetails: gamepad,
            name: gamepad.id,
            index: gamepad.index,
            type: InputDeviceType.Gamepad,
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
