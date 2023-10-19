import {SerializedGamepad} from './gamepad/serialized-gamepad';
import {AnyInputDeviceKey, GamepadInputDeviceKey, inputDeviceKey} from './input-device-key';
import {InputDeviceTypeEnum} from './input-device-type';
import {
    DeviceInputValue,
    GamepadInputValue,
    KeyboardInputValue,
    MouseInputValue,
} from './input-value';
export type GamepadDetails = SerializedGamepad;

export type DeviceDetails = undefined | GamepadDetails;

export type DeviceWrapper<
    DeviceTypeGeneric extends InputDeviceTypeEnum,
    KeyTypeGeneric extends AnyInputDeviceKey,
    DeviceDetailsGeneric extends DeviceDetails,
    InputValueTypeGeneric extends DeviceInputValue,
> = Readonly<{
    deviceType: DeviceTypeGeneric;
    deviceKey: KeyTypeGeneric;
    deviceName: string;
    deviceDetails: DeviceDetailsGeneric;
    currentInputs: Readonly<Record<DeviceInputValue['inputName'], InputValueTypeGeneric>>;
}>;

export type GamepadDevice = DeviceWrapper<
    InputDeviceTypeEnum.Gamepad,
    GamepadInputDeviceKey,
    GamepadDetails,
    GamepadInputValue
>;

export type KeyboardDevice = DeviceWrapper<
    InputDeviceTypeEnum.Keyboard,
    typeof inputDeviceKey.keyboard,
    undefined,
    KeyboardInputValue
>;

export type MouseDevice = DeviceWrapper<
    InputDeviceTypeEnum.Mouse,
    typeof inputDeviceKey.mouse,
    undefined,
    MouseInputValue
>;

export type InputDevice = GamepadDevice | KeyboardDevice | MouseDevice;

export type DeviceTypeEnumToDeviceTypeObjectMapping = {
    [InputDeviceTypeEnum.Gamepad]: GamepadDevice;
    [InputDeviceTypeEnum.Keyboard]: KeyboardDevice;
    [InputDeviceTypeEnum.Mouse]: MouseDevice;
};

export function isOfInputDeviceType<const DeviceTypeGeneric extends InputDeviceTypeEnum>(
    inputDevice: InputDevice,
    inputType: DeviceTypeGeneric,
): inputDevice is DeviceTypeEnumToDeviceTypeObjectMapping[DeviceTypeGeneric] {
    return inputDevice.deviceType === inputType;
}

export const keyboardBaseDevice: Readonly<Omit<KeyboardDevice, 'currentInputs'>> = {
    deviceDetails: undefined,
    deviceKey: inputDeviceKey.keyboard,
    deviceName: 'keyboard',
    deviceType: InputDeviceTypeEnum.Keyboard,
};

export const mouseBaseDevice: Readonly<Omit<MouseDevice, 'currentInputs'>> = {
    deviceDetails: undefined,
    deviceKey: inputDeviceKey.mouse,
    deviceName: 'mouse',
    deviceType: InputDeviceTypeEnum.Mouse,
};
