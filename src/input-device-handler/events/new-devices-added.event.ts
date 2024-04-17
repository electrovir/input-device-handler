import {
    getObjectTypedKeys,
    getObjectTypedValues,
    isTruthy,
    typedHasProperty,
} from '@augment-vir/common';
import {InputDevice} from '../../device/input-device';
import {ConstructEventIfDataIsNew, defineTimedEvent} from '../event-util/timed-event';

export type NewDevicesAddedOutput = InputDevice[];

function areThereNewDevices(
    ...[
        previousInputDevices,
        newInputDevices,
    ]: Parameters<ConstructEventIfDataIsNew<NewDevicesAddedOutput>>
): ReturnType<ConstructEventIfDataIsNew<NewDevicesAddedOutput>> {
    if (!previousInputDevices) {
        return getObjectTypedValues(newInputDevices).filter(isTruthy);
    }

    const newDeviceKeys = getObjectTypedKeys(newInputDevices).filter((newKey) => {
        return !typedHasProperty(previousInputDevices, newKey);
    });

    if (newDeviceKeys.length) {
        return newDeviceKeys.map((newKey) => newInputDevices[newKey]).filter(isTruthy);
    } else {
        return undefined;
    }
}

export class NewDevicesAddedEvent extends defineTimedEvent<NewDevicesAddedOutput>()(
    'new-devices-added',
    areThereNewDevices,
) {}
