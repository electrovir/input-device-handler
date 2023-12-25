import {getObjectTypedKeys, isTruthy, typedHasProperty} from '@augment-vir/common';
import {InputDevice} from '../../device/input-device';
import {ConstructEventIfDataIsNew, DeviceHandlerEventTypeEnum} from '../event-util/event-types';
import {defineTimedEvent} from '../event-util/timed-event';

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

export const DevicesRemovedEvent = defineTimedEvent<DevicesRemovedOutput>()(
    DeviceHandlerEventTypeEnum.DevicesRemoved,
    wereDevicesRemoved,
);

export type DevicesRemovedEvent = InstanceType<typeof DevicesRemovedEvent>;
