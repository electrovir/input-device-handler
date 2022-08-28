import {getObjectTypedKeys, getObjectTypedValues, isTruthy, typedHasOwnProperty} from 'augment-vir';
import {InputDevice} from '../../device/input-device';
import {EventDataCheckCallback, InputDeviceHandlerEventTypeEnum} from '../event-util/event-types';
import {defineTimedEvent} from '../event-util/timed.event';

type NewDevicesAddedOutput = InputDevice[];

function newDevicesAddedDataCheckCallback(
    ...[
        previousInputDevices,
        newInputDevices,
    ]: Parameters<EventDataCheckCallback<NewDevicesAddedOutput>>
): ReturnType<EventDataCheckCallback<NewDevicesAddedOutput>> {
    if (!previousInputDevices) {
        return getObjectTypedValues(newInputDevices);
    }

    const newDeviceKeys = getObjectTypedKeys(newInputDevices).filter((newKey) => {
        return !typedHasOwnProperty(previousInputDevices, newKey);
    });

    if (newDeviceKeys.length) {
        return newDeviceKeys.map((newKey) => newInputDevices[newKey]).filter(isTruthy);
    } else {
        return undefined;
    }
}

export class NewDevicesAddedEvent extends defineTimedEvent<NewDevicesAddedOutput>()(
    InputDeviceHandlerEventTypeEnum.NewDevicesAdded,
    newDevicesAddedDataCheckCallback,
) {}
