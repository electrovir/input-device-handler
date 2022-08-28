import {AllInputDevices} from '../../device/all-input-devices';
import {EventDataCheckCallback, InputDeviceHandlerEventTypeEnum} from '../event-util/event-types';
import {defineTimedEvent} from '../event-util/timed.event';

function allDevicesUpdatedDataCheckCallback(
    ...inputs: Parameters<EventDataCheckCallback<AllInputDevices>>
): ReturnType<EventDataCheckCallback<AllInputDevices>> {
    return undefined;
}

export class AllDevicesUpdatedEvent extends defineTimedEvent<AllInputDevices>()(
    InputDeviceHandlerEventTypeEnum.AllDevicesUpdated,
    allDevicesUpdatedDataCheckCallback,
) {}
