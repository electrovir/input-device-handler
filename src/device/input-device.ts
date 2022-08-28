import {keyboardDeviceKeySymbol, mouseDeviceKeySymbol, PotentialDeviceKeys} from './device-id';
import {SerializedGamepad} from './gamepad/serialized-gamepad';
import {InputDeviceType} from './input-device-type';
import {
    DeviceInputValue,
    GamepadInputValue,
    KeyboardInputValue,
    MouseInputValue,
} from './input-value';

export type MouseDetails = undefined;
export type KeyboardDetails = undefined;
export type GamepadDetails = SerializedGamepad;

type DeviceDetails = MouseDetails | KeyboardDetails | GamepadDetails;

type InputDeviceDefiner<
    DeviceTypeGeneric extends InputDeviceType,
    KeyTypeGeneric extends PotentialDeviceKeys,
    DeviceDetailsGeneric extends DeviceDetails,
    InputValueTypeGeneric extends DeviceInputValue,
> = Readonly<{
    deviceType: DeviceTypeGeneric;
    deviceKey: KeyTypeGeneric;
    deviceName: string;
    deviceDetails: DeviceDetailsGeneric;
    currentInputs: Readonly<Record<DeviceInputValue['inputName'], InputValueTypeGeneric>>;
}>;

export type GamepadInputDevice = InputDeviceDefiner<
    InputDeviceType.Gamepad,
    number,
    GamepadDetails,
    GamepadInputValue
>;

export type KeyboardInputDevice = InputDeviceDefiner<
    InputDeviceType.Keyboard,
    typeof keyboardDeviceKeySymbol,
    KeyboardDetails,
    KeyboardInputValue
>;

export type MouseInputDevice = InputDeviceDefiner<
    InputDeviceType.Mouse,
    typeof mouseDeviceKeySymbol,
    MouseDetails,
    MouseInputValue
>;

export type InputDevice = GamepadInputDevice | KeyboardInputDevice | MouseInputDevice;

type DeviceTypeEnumToDeviceTypeObjectMapping = {
    [InputDeviceType.Gamepad]: GamepadInputDevice;
    [InputDeviceType.Keyboard]: KeyboardInputDevice;
    [InputDeviceType.Mouse]: MouseInputDevice;
};

export function isOfInputDeviceType<DeviceTypeGeneric extends InputDeviceType>(
    inputDevice: InputDevice,
    inputType: DeviceTypeGeneric,
): inputDevice is DeviceTypeEnumToDeviceTypeObjectMapping[DeviceTypeGeneric] {
    return inputDevice.deviceType === inputType;
}

export const keyboardBaseDevice: Readonly<Omit<KeyboardInputDevice, 'currentInputs'>> = {
    deviceDetails: undefined,
    deviceKey: keyboardDeviceKeySymbol,
    deviceName: 'keyboard',
    deviceType: InputDeviceType.Keyboard,
};

export const mouseBaseDevice: Readonly<Omit<MouseInputDevice, 'currentInputs'>> = {
    deviceDetails: undefined,
    deviceKey: mouseDeviceKeySymbol,
    deviceName: 'mouse',
    deviceType: InputDeviceType.Mouse,
};
