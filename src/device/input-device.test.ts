import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {InputDeviceType} from './input-device-type.js';
import {type GamepadDevice, type InputDevice, isOfInputDeviceType} from './input-device.js';

describe('InputDevice types', () => {
    it('should allow generic types as well as specific types', () => {
        const genericInputDevice: InputDevice = {
            deviceType: InputDeviceType.Gamepad,
            deviceKey: '0',
            deviceName: 'test device name',
            currentInputs: {},
            deviceDetails: {
                isConnected: false,
                gamepadName: 'gamepad id',
                deviceKey: '3',
                mapping: '',
                serialized: true,
                timestamp: 0,
                axes: [],
                buttons: [],
                inputsByName: {},
            },
        };

        if (isOfInputDeviceType(genericInputDevice, InputDeviceType.Gamepad)) {
            const shouldBeGamepadType: GamepadDevice = genericInputDevice;
            // this is the path that should be taken
            assert.isTrue(true, 'this is the path that the type guard should take');
        } else {
            const shouldBeOtherType: InputDevice = genericInputDevice;
            // @ts-expect-error: should fail here
            const genericInputDeviceShouldNotWorkHere: GamepadDevice =
                genericInputDevice as InputDevice;
            assert.isFalse(true, 'the type guard should have been true');
        }
    });
});
