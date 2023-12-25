import {AllDevices} from '../../device/all-input-devices';
import {ConstructEventIfDataIsNew, DeviceHandlerEventTypeEnum} from '../event-util/event-types';
import {defineTimedEvent} from '../event-util/timed-event';

function allDevicesUpdatedDataCheckCallback(
    ...[
        previousInputDevices,
        newInputDevices,
    ]: Parameters<ConstructEventIfDataIsNew<AllDevices>>
): ReturnType<ConstructEventIfDataIsNew<AllDevices>> {
    // this input gets triggered every time
    return newInputDevices;
}

/**
 * This event is triggered any time devices are updated (either manually or on each poll event).
 * This will fire even if there were no changes to the devices or their current inputs.
 */
export const AllDevicesUpdatedEvent = defineTimedEvent<AllDevices>()(
    DeviceHandlerEventTypeEnum.AllDevicesUpdated,
    allDevicesUpdatedDataCheckCallback,
);
export type AllDevicesUpdatedEvent = InstanceType<typeof AllDevicesUpdatedEvent>;
