import {InputName} from './gamepad/gamepad-input-names';
import {SerializedGamepadButton} from './gamepad/serialized-gamepad';
import {AnyInputDeviceKey, GamepadInputDeviceKey, inputDeviceKey} from './input-device-key';
import {InputDeviceTypeEnum} from './input-device-type';

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

/** A helper for creating values for each input device. */
type InputValueWrapper<
    SpecificDeviceKey extends AnyInputDeviceKey,
    SpecificInputDetails extends DeviceInputDetails,
> = Readonly<{
    deviceName: string;
    deviceKey: SpecificDeviceKey;
    deviceType: InputDeviceTypeEnum;
    inputName: InputName;
    inputValue: number;
    details: Readonly<SpecificInputDetails>;
}>;

export type KeyboardInputValue = InputValueWrapper<
    typeof inputDeviceKey.keyboard,
    KeyboardInputDetails
>;

export type MouseInputValue = InputValueWrapper<typeof inputDeviceKey.mouse, MouseInputDetails>;

export type GamepadInputValue = InputValueWrapper<GamepadInputDeviceKey, GamepadInputDetails>;

export type DeviceInputValue = KeyboardInputValue | MouseInputValue | GamepadInputValue;
