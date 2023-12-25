import {
    getObjectTypedKeys,
    getObjectTypedValues,
    isTruthy,
    typedHasProperty,
} from '@augment-vir/common';
import {InputDevice} from '../../device/input-device';
import {ConstructEventIfDataIsNew, DeviceHandlerEventTypeEnum} from '../event-util/event-types';
import {defineTimedEvent} from '../event-util/timed-event';

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

export const NewDevicesAddedEvent = defineTimedEvent<NewDevicesAddedOutput>()(
    DeviceHandlerEventTypeEnum.NewDevicesAdded,
    areThereNewDevices,
);

export type NewDevicesAddedEvent = InstanceType<typeof NewDevicesAddedEvent>;
