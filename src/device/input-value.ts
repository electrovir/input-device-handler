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

export type DeviceInputDetails = KeyboardInputDetails | MouseInputDetails | GamepadInputDetails;

/** A helper for creating values for each input device. */
export type InputValueWrapper<
    SpecificDeviceKey extends AnyInputDeviceKey,
    SpecificInputDetails extends DeviceInputDetails,
> = Readonly<{
    /**
     * Human friendly name of the device. For gamepads, this will vary by browser (as they all read
     * the names differently) and by the make and model of the gamepad.
     */
    deviceName: string;
    /** The device's unique key. */
    deviceKey: SpecificDeviceKey;
    /** The type of device: gamepad, mouse, or keyboard. */
    deviceType: InputDeviceTypeEnum;
    inputName: string;
    inputValue: number;
    /** Extra details for the input that depend on the device the input came from. */
    details: Readonly<SpecificInputDetails>;
}>;

export type KeyboardInputValue = InputValueWrapper<
    typeof inputDeviceKey.keyboard,
    KeyboardInputDetails
>;

export type MouseInputValue = InputValueWrapper<typeof inputDeviceKey.mouse, MouseInputDetails>;

export type GamepadInputValue = InputValueWrapper<GamepadInputDeviceKey, GamepadInputDetails>;

export type DeviceInputValue = KeyboardInputValue | MouseInputValue | GamepadInputValue;
