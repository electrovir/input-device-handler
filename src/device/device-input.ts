import {keyboardDeviceIdSymbol, mouseDeviceIdSymbol, PotentialDeviceIds} from './device-id';
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
    DeviceIdGeneric extends PotentialDeviceIds,
    DeviceIndexGeneric extends number,
    InputDetailsGeneric extends DeviceInputDetails,
> = {
    deviceName: DeviceIdGeneric;
    deviceIndex: DeviceIndexGeneric;
    deviceType: InputDeviceType;
    inputName: string | number;
    value: number;
    details: InputDetailsGeneric;
};

export type KeyboardInputValue = InputValueDefiner<
    typeof keyboardDeviceIdSymbol,
    -1,
    KeyboardInputDetails
>;

export type MouseInputValue = InputValueDefiner<typeof mouseDeviceIdSymbol, -1, MouseInputDetails>;

export type GamepadInputValue = InputValueDefiner<string, number, GamepadInputDetails>;
