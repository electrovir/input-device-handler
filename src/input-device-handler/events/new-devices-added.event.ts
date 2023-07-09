import {
    getObjectTypedKeys,
    getObjectTypedValues,
    isTruthy,
    typedHasProperty,
} from '@augment-vir/common';
import {InputDevice} from '../../device/input-device';
import {ConstructEventIfDataIsNew, InputDeviceEventTypeEnum} from '../event-util/event-types';
import {defineTimedEvent} from '../event-util/timed-event';

type NewDevicesAddedOutput = InputDevice[];

function areThereNewDevices(
    ...[
        previousInputDevices,
        newInputDevices,
    ]: Parameters<ConstructEventIfDataIsNew<NewDevicesAddedOutput>>
): ReturnType<ConstructEventIfDataIsNew<NewDevicesAddedOutput>> {
    if (!previousInputDevices) {
        return getObjectTypedValues(newInputDevices);
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
    InputDeviceEventTypeEnum.NewDevicesAdded,
    areThereNewDevices,
);

export type NewDevicesAddedEvent = InstanceType<typeof NewDevicesAddedEvent>;
