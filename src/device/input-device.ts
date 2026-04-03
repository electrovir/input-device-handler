import {type SerializedGamepad} from './gamepad/serialized-gamepad.js';
import {type GamepadInputDeviceKey, InputDeviceKey} from './input-device-key.js';
import {InputDeviceType} from './input-device-type.js';
import {
    type DeviceInputValue,
    type GamepadInputValue,
    type KeyboardInputValue,
    type MouseInputValue,
} from './input-value.js';

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
 * @category Internal
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
 * @category Internal
 */
export type KeyboardDevice = DeviceWrapper<
    InputDeviceType.Keyboard,
    typeof InputDeviceKey.Keyboard,
    undefined,
    KeyboardInputValue
>;

/**
 * A mouse device.
 *
 * @category Internal
 */
export type MouseDevice = DeviceWrapper<
    InputDeviceType.Mouse,
    typeof InputDeviceKey.Mouse,
    undefined,
    MouseInputValue
>;

/**
 * Any supported device.
 *
 * @category Internal
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
    deviceKey: InputDeviceKey.Keyboard,
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
    deviceKey: InputDeviceKey.Mouse,
    deviceName: 'mouse',
    deviceType: InputDeviceType.Mouse,
};

/**
 * Maps each {@link InputDeviceKey} value to its respective {@link InputDeviceType}.
 *
 * @category Util
 */
export const inputDeviceKeyToInputDeviceType = {
    [InputDeviceKey.Gamepad1]: InputDeviceType.Gamepad,
    [InputDeviceKey.Gamepad2]: InputDeviceType.Gamepad,
    [InputDeviceKey.Gamepad3]: InputDeviceType.Gamepad,
    [InputDeviceKey.Gamepad4]: InputDeviceType.Gamepad,
    [InputDeviceKey.Keyboard]: InputDeviceType.Keyboard,
    [InputDeviceKey.Mouse]: InputDeviceType.Mouse,
} as const satisfies Record<InputDeviceKey, InputDeviceType>;
