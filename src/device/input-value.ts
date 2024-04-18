import {SerializedGamepadInput} from './gamepad/serialized-gamepad';
import {GamepadInputDeviceKey, InputDeviceKey, inputDeviceKey} from './input-device-key';
import {InputDeviceType} from './input-device-type';

/**
 * Extra, non-serializable, details for a mouse device's input value.
 *
 * @category Internal
 */
export type MouseInputDetails = {
    mouseEvent: MouseEvent;
};

/**
 * Extra, non-serializable, details for a keyboard device's input value.
 *
 * @category Internal
 */
export type KeyboardInputDetails = {
    keyboardEvent: KeyboardEvent;
};

/**
 * Extra, non-serializable, details for a gamepad device's input value.
 *
 * @category Internal
 */
export type GamepadInputDetails = SerializedGamepadInput;

/**
 * All extra details for a device's input value.
 *
 * @category Internal
 */
export type DeviceInputDetails = KeyboardInputDetails | MouseInputDetails | GamepadInputDetails;

/**
 * A single input's value, with extra details depending on which device the input is from.
 *
 * @category Internal
 */
export type InputValueWrapper<
    SpecificDeviceKey extends InputDeviceKey,
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
    deviceType: InputDeviceType;
    inputName: string;
    inputValue: number;
    /** Extra details for the input that depend on the device the input came from. */
    details: Readonly<SpecificInputDetails>;
}>;

/**
 * Input values from keyboard devices.
 *
 * @category Types
 */
export type KeyboardInputValue = InputValueWrapper<
    typeof inputDeviceKey.keyboard,
    KeyboardInputDetails
>;

/**
 * Input values from mouse devices.
 *
 * @category Types
 */
export type MouseInputValue = InputValueWrapper<typeof inputDeviceKey.mouse, MouseInputDetails>;

/**
 * Input values from gamepad devices.
 *
 * @category Types
 */
export type GamepadInputValue = InputValueWrapper<GamepadInputDeviceKey, GamepadInputDetails>;

/**
 * Input values from any supported device.
 *
 * @category Types
 */
export type DeviceInputValue = KeyboardInputValue | MouseInputValue | GamepadInputValue;
