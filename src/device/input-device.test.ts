import {assert} from '@open-wc/testing';
import {GamepadDevice, InputDevice, isOfInputDeviceType} from './input-device';
import {InputDeviceTypeEnum} from './input-device-type';

describe('InputDevice types', () => {
    it('should allow generic types as well as specific types', () => {
        const genericInputDevice: InputDevice = {
            deviceType: InputDeviceTypeEnum.Gamepad,
            deviceKey: 0,
            deviceName: 'test device name',
            currentInputs: {},
            deviceDetails: {
                connected: false,
                id: 'gamepad id',
                index: 3,
                mapping: '',
                serialized: true,
                timestamp: 0,
                axes: [],
                buttons: [],
            },
        };

        if (isOfInputDeviceType(genericInputDevice, InputDeviceTypeEnum.Gamepad)) {
            const shouldBeGamepadType: GamepadDevice = genericInputDevice;
            // this is the path that should be taken
            assert.isTrue(true, 'this is the path that the type guard should take');
        } else {
            const shouldBeOtherType: InputDevice = genericInputDevice;
            // @ts-expect-error
            const genericInputDeviceShouldNotWorkHere: GamepadDevice =
                genericInputDevice as InputDevice;
            assert.isFalse(true, 'the type guard should have been true');
        }
    });
});
