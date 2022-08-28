import {AllInputDevices} from '../../device/all-input-devices';
import {EventDataCheckCallback, InputDeviceHandlerEventTypeEnum} from '../event-util/event-types';
import {defineTimedEvent} from '../event-util/timed.event';

function newInputDetected(
    ...[
        previousInputDevices,
        newInputDevices,
    ]: Parameters<EventDataCheckCallback<AllInputDevices>>
): ReturnType<EventDataCheckCallback<AllInputDevices>> {
    // this input gets triggered every time
    return newInputDevices;
}

export class AllDevicesUpdatedEvent extends defineTimedEvent<AllInputDevices>()(
    InputDeviceHandlerEventTypeEnum.AllDevicesUpdated,
    newInputDetected,
) {}
