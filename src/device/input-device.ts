import {SerializedGamepad} from './gamepad/serialized-gamepad';
import {GamepadInputDeviceKey, InputDeviceKey, inputDeviceKey} from './input-device-key';
import {InputDeviceType} from './input-device-type';
import {
    DeviceInputValue,
    GamepadInputValue,
    KeyboardInputValue,
    MouseInputValue,
} from './input-value';

/**
 * Extra device details supported by some input devices.
 *
 * @category Internal
 */
export type DeviceDetailsBase = undefined | SerializedGamepad;

/**
 * Wrap the given device parameters into a device object.
 *
 * @category Internal
 */
export type DeviceWrapper<
    DeviceType extends InputDeviceType,
    DeviceKey extends InputDeviceKey,
    DeviceDetails extends DeviceDetailsBase,
    InputValue extends DeviceInputValue,
> = Readonly<{
    deviceType: DeviceType;
    deviceKey: DeviceKey;
    deviceName: string;
    deviceDetails: DeviceDetails;
    currentInputs: Readonly<Record<string, InputValue>>;
}>;

/**
 * A gamepad device.
 *
 * @category Types
 */
export type GamepadDevice = DeviceWrapper<
    InputDeviceType.Gamepad,
    GamepadInputDeviceKey,
    SerializedGamepad,
    GamepadInputValue
>;

/**
 * A keyboard device.
 *
 * @category Types
 */
export type KeyboardDevice = DeviceWrapper<
    InputDeviceType.Keyboard,
    typeof inputDeviceKey.keyboard,
    undefined,
    KeyboardInputValue
>;

/**
 * A mouse device.
 *
 * @category Types
 */
export type MouseDevice = DeviceWrapper<
    InputDeviceType.Mouse,
    typeof inputDeviceKey.mouse,
    undefined,
    MouseInputValue
>;

/**
 * Any supported device.
 *
 * @category Types
 */
export type InputDevice = GamepadDevice | KeyboardDevice | MouseDevice;

/**
 * A mapping of device type strings to their respective device object types.
 *
 * @category Internal
 */
export type DeviceTypeToDeviceTypeObjectMapping = {
    [InputDeviceType.Gamepad]: GamepadDevice;
    [InputDeviceType.Keyboard]: KeyboardDevice;
    [InputDeviceType.Mouse]: MouseDevice;
};

/**
 * A type guard for determining if the input device matches the requested device type.
 *
 * @category Util
 */
export function isOfInputDeviceType<const DeviceTypeGeneric extends InputDeviceType>(
    inputDevice: InputDevice,
    inputType: DeviceTypeGeneric,
): inputDevice is DeviceTypeToDeviceTypeObjectMapping[DeviceTypeGeneric] {
    return inputDevice.deviceType === inputType;
}

/**
 * Base keyboard device used for starting up `InputDeviceHandler`.
 *
 * @category Internal
 */
export const keyboardBaseDevice: Readonly<Omit<KeyboardDevice, 'currentInputs'>> = {
    deviceDetails: undefined,
    deviceKey: inputDeviceKey.keyboard,
    deviceName: 'keyboard',
    deviceType: InputDeviceType.Keyboard,
};

/**
 * Base mouse device used for starting up `InputDeviceHandler`.
 *
 * @category Internal
 */
export const mouseBaseDevice: Readonly<Omit<MouseDevice, 'currentInputs'>> = {
    deviceDetails: undefined,
    deviceKey: inputDeviceKey.mouse,
    deviceName: 'mouse',
    deviceType: InputDeviceType.Mouse,
};
