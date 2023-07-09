import {getObjectTypedKeys, isTruthy, typedHasProperty} from '@augment-vir/common';
import {InputDevice} from '../../device/input-device';
import {ConstructEventIfDataIsNew, InputDeviceEventTypeEnum} from '../event-util/event-types';
import {defineTimedEvent} from '../event-util/timed-event';

type DevicesRemovedOutput = InputDevice[];

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
    InputDeviceEventTypeEnum.DevicesRemoved,
    wereDevicesRemoved,
);

export type DevicesRemovedEvent = InstanceType<typeof DevicesRemovedEvent>;
