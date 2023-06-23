import {AllDevices} from '../../device/all-input-devices';

export enum InputDeviceHandlerEventTypeEnum {
    NewDevicesAdded = 'new-devices-added',
    AllDevicesUpdated = 'all-devices-updated',
    CurrentInputsChanged = 'current-inputs-updated',
    DevicesRemoved = 'devices-removed',
}

export type EventDataCheckCallback<EventDataGeneric> = (
    previousValues: AllDevices | undefined,
    latestValues: AllDevices,
) => EventDataGeneric | undefined;
