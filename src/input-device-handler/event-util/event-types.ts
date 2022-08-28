import {AllInputDevices} from '../../device/all-input-devices';

export enum InputDeviceHandlerEventTypeEnum {
    NewDeviceAdded = 'new-device-added',
    AllDevicesUpdated = 'all-devices-updated',
    CurrentInputsChanged = 'current-inputs-updated',
}

export type EventDataCheckCallback<EventDataGeneric> = (
    previousValues: AllInputDevices,
    latestValues: AllInputDevices,
) => EventDataGeneric | undefined;
