import {getObjectTypedKeys, isTruthy, typedHasProperty} from '@augment-vir/common';
import {InputDevice} from '../../device/input-device';
import {ConstructEventIfDataIsNew, defineTimedEvent} from '../event-util/timed-event';

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
        return !typedHasProperty(newInputDevices, newKey);
    });

    if (removedDeviceKeys.length) {
        return removedDeviceKeys.map((newKey) => previousInputDevices[newKey]).filter(isTruthy);
    } else {
        return undefined;
    }
}

export class DevicesRemovedEvent extends defineTimedEvent<DevicesRemovedOutput>()(
    'devices-removed',
    wereDevicesRemoved,
) {}
