import {keyboardDeviceKeySymbol, mouseDeviceKeySymbol, PotentialDeviceKeys} from './device-id';
import {SerializedGamepadButton} from './gamepad/serialized-gamepad';
import {InputDeviceType} from './input-device-type';

export type MouseInputDetails = {
    mouseEvent: MouseEvent;
};

export type KeyboardInputDetails = {
    keyboardEvent: KeyboardEvent;
};

export enum GamepadInputType {
    Button = 'button',
    Axe = 'axe',
}

export type GamepadAxeInputDetails = {
    inputType: GamepadInputType.Axe;
};

export type GamepadButtonInputDetails = {
    inputType: GamepadInputType.Button;
    buttonDetails: SerializedGamepadButton;
};

export type GamepadInputDetails = GamepadAxeInputDetails | GamepadButtonInputDetails;

type DeviceInputDetails = KeyboardInputDetails | MouseInputDetails | GamepadInputDetails;

export type DeviceInputValue = KeyboardInputValue | MouseInputValue | GamepadInputValue;

type InputValueDefiner<
    DeviceKeyGeneric extends PotentialDeviceKeys,
    InputDetailsGeneric extends DeviceInputDetails,
> = Readonly<{
    deviceName: string;
    deviceKey: DeviceKeyGeneric;
    deviceType: InputDeviceType;
    // number is needed here for mouse buttons which are numbers
    inputName: string | number;
    inputValue: number;
    details: Readonly<InputDetailsGeneric>;
}>;

export type KeyboardInputValue = InputValueDefiner<
    typeof keyboardDeviceKeySymbol,
    KeyboardInputDetails
>;

export type MouseInputValue = InputValueDefiner<typeof mouseDeviceKeySymbol, MouseInputDetails>;

export type GamepadInputValue = InputValueDefiner<number, GamepadInputDetails>;
