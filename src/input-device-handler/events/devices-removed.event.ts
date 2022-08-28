import {getObjectTypedKeys, isTruthy, typedHasOwnProperty} from 'augment-vir';
import {InputDevice} from '../../device/input-device';
import {EventDataCheckCallback, InputDeviceHandlerEventTypeEnum} from '../event-util/event-types';
import {defineTimedEvent} from '../event-util/timed.event';

type DevicesRemovedOutput = InputDevice[];

function devicesRemovedDataCheckCallback(
    ...[
        previousInputDevices,
        newInputDevices,
    ]: Parameters<EventDataCheckCallback<DevicesRemovedOutput>>
): ReturnType<EventDataCheckCallback<DevicesRemovedOutput>> {
    if (!previousInputDevices) {
        return [];
    }

    const removedDeviceKeys = getObjectTypedKeys(previousInputDevices).filter((newKey) => {
        return !typedHasOwnProperty(newInputDevices, newKey);
    });

    if (removedDeviceKeys.length) {
        return removedDeviceKeys.map((newKey) => previousInputDevices[newKey]).filter(isTruthy);
    } else {
        return undefined;
    }
}

export class DevicesRemovedEvent extends defineTimedEvent<DevicesRemovedOutput>()(
    InputDeviceHandlerEventTypeEnum.DevicesRemoved,
    devicesRemovedDataCheckCallback,
) {}
