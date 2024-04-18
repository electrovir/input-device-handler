import {
    getObjectTypedKeys,
    getObjectTypedValues,
    isTruthy,
    typedHasProperty,
} from '@augment-vir/common';
import {InputDevice} from '../../device/input-device';
import {ConstructEventIfDataIsNew, defineTimedEvent} from '../event-util/timed-event';

/**
 * The data contained within a `NewDevicesAddedEvent` event.
 *
 * @category Events
 */
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

/**
 * This event is triggered any time a new device is added or connected.
 *
 * @category Events
 */
export const NewDevicesAddedEvent = defineTimedEvent<NewDevicesAddedOutput>()(
    'new-devices-added',
    areThereNewDevices,
);
/**
 * Type for `NewDevicesAddedEvent` because it's a faked class.
 *
 * @category Internal
 */
export type NewDevicesAddedEvent = InstanceType<typeof NewDevicesAddedEvent>;
