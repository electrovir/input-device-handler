import {keyboardDeviceIdSymbol, mouseDeviceIdSymbol, PotentialDeviceIds} from './device-id';
import {
    DeviceInputValue,
    GamepadInputValue,
    KeyboardInputValue,
    MouseInputValue,
} from './device-input';
import {SerializedGamepad} from './gamepad/serialized-gamepad';
import {InputDeviceType} from './input-device-type';

export type MouseDetails = undefined;
export type KeyboardDetails = undefined;
export type GamepadDetails = SerializedGamepad;

type DeviceDetails = MouseDetails | KeyboardDetails | GamepadDetails;

type InputDeviceDefiner<
    DeviceTypeGeneric extends InputDeviceType,
    IdTypeGeneric extends PotentialDeviceIds,
    DeviceDetailsGeneric extends DeviceDetails,
    InputValueTypeGeneric extends DeviceInputValue,
    IndexGeneric extends number,
> = Readonly<{
    type: DeviceTypeGeneric;
    name: IdTypeGeneric;
    index: IndexGeneric;
    deviceDetails: DeviceDetailsGeneric;
    currentInputs: Record<DeviceInputValue['inputName'], InputValueTypeGeneric>;
}>;

export type GamepadInputDevice = InputDeviceDefiner<
    InputDeviceType.Gamepad,
    string,
    GamepadDetails,
    GamepadInputValue,
    number
>;

export type KeyboardInputDevice = InputDeviceDefiner<
    InputDeviceType.Keyboard,
    typeof keyboardDeviceIdSymbol,
    KeyboardDetails,
    KeyboardInputValue,
    -1
>;

export type MouseInputDevice = InputDeviceDefiner<
    InputDeviceType.Mouse,
    typeof mouseDeviceIdSymbol,
    MouseDetails,
    MouseInputValue,
    -1
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
    return inputDevice.type === inputType;
}

export const keyboardBaseDevice: Readonly<Omit<KeyboardInputDevice, 'currentInputs'>> = {
    deviceDetails: undefined,
    index: -1,
    name: keyboardDeviceIdSymbol,
    type: InputDeviceType.Keyboard,
};

export const mouseBaseDevice: Readonly<Omit<MouseInputDevice, 'currentInputs'>> = {
    deviceDetails: undefined,
    index: -1,
    name: mouseDeviceIdSymbol,
    type: InputDeviceType.Mouse,
};
