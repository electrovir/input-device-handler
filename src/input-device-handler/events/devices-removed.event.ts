import {check} from '@augment-vir/assert';
import {getObjectTypedKeys} from '@augment-vir/common';
import {InputDevice} from '../../device/input-device.js';
import {ConstructEventIfDataIsNew, defineTimedEvent} from '../event-util/timed-event.js';

/**
 * The data contained within a `DevicesRemovedEvent` event.
 *
 * @category Events
 */
export type DevicesRemovedOutput = InputDevice[];

function wereDevicesRemoved(
    ...[
        previousInputDevices,
        newInputDevices,
    ]: Parameters<ConstructEventIfDataIsNew<DevicesRemovedOutput>>
): ReturnType<ConstructEventIfDataIsNew<DevicesRemovedOutput>> {
    if (!previousInputDevices) {
        return [];
    }

    const removedDeviceKeys = getObjectTypedKeys(previousInputDevices).filter((newKey) => {
        return !check.hasKey(newInputDevices, newKey);
    });

    if (removedDeviceKeys.length) {
        return removedDeviceKeys
            .map((newKey) => previousInputDevices[newKey])
            .filter(check.isTruthy);
    } else {
        return undefined;
    }
}

/**
 * This event is triggered any time a device is removed or disconnected.
 *
 * @category Events
 */
export const DevicesRemovedEvent = defineTimedEvent<DevicesRemovedOutput>()(
    'devices-removed',
    wereDevicesRemoved,
);
/**
 * Type for `DevicesRemovedEvent` because it's a faked class.
 *
 * @category Internal
 */
export type DevicesRemovedEvent = InstanceType<typeof DevicesRemovedEvent>;
