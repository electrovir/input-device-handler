import {AllDevices} from '../../device/all-input-devices';
import {ConstructEventIfDataIsNew, defineTimedEvent} from '../event-util/timed-event';

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
 *
 * @category Events
 */
export const AllDevicesUpdatedEvent = defineTimedEvent<AllDevices>()(
    'all-devices-updated',
    allDevicesUpdatedDataCheckCallback,
);
/**
 * Type for `AllDevicesUpdatedEvent` because it's a faked class.
 *
 * @category Internal
 */
export type AllDevicesUpdatedEvent = InstanceType<typeof AllDevicesUpdatedEvent>;
