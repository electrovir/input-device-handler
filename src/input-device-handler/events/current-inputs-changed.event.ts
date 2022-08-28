import {areJsonEqual} from 'augment-vir';
import {allInputDevicesToAllInputs} from '../../device/all-input-devices';
import {DeviceInputValue} from '../../device/device-input';
import {EventDataCheckCallback, InputDeviceHandlerEventTypeEnum} from '../event-util/event-types';
import {defineTimedEvent} from '../event-util/timed.event';

function currentInputsChangedDataCheckCallback(
    ...[
        previousInputDevices,
        newInputDevices,
    ]: Parameters<EventDataCheckCallback<DeviceInputValue[]>>
): ReturnType<EventDataCheckCallback<DeviceInputValue[]>> {
    const allNewInputs = allInputDevicesToAllInputs(newInputDevices);

    if (!previousInputDevices) {
        return allNewInputs;
    }
    const allPreviousInputs = allInputDevicesToAllInputs(previousInputDevices);

    if (areJsonEqual(allPreviousInputs, allNewInputs)) {
        return undefined;
    } else {
        return allNewInputs;
    }
}

export class CurrentInputsChangedEvent extends defineTimedEvent<DeviceInputValue[]>()(
    InputDeviceHandlerEventTypeEnum.CurrentInputsChanged,
    currentInputsChangedDataCheckCallback,
) {}
