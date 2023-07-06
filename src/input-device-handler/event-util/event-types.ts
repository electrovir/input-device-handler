import {AllDevices} from '../../device/all-input-devices';

export enum InputDeviceEventTypeEnum {
    NewDevicesAdded = 'new-devices-added',
    /**
     * This event is triggered any time devices are updated (either manually or on each poll event).
     * This will fire even if there were no changes to the devices or their current inputs.
     */
    AllDevicesUpdated = 'all-devices-updated',
    CurrentInputsChanged = 'current-inputs-updated',
    DevicesRemoved = 'devices-removed',
}

export type ConstructEventIfDataIsNew<EventDataGeneric> = (
    previousValues: AllDevices | undefined,
    latestValues: AllDevices,
) => EventDataGeneric | undefined;
