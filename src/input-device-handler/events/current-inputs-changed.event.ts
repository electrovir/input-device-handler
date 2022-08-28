import {areJsonEqual} from 'augment-vir';
import {allInputDevicesToAllInputs} from '../../device/all-input-devices';
import {DeviceInputValue} from '../../device/input-value';
import {EventDataCheckCallback, InputDeviceHandlerEventTypeEnum} from '../event-util/event-types';
import {defineTimedEvent} from '../event-util/timed.event';

export type CurrentInputsChangedOutput = {
    newInputs: DeviceInputValue[];
    removedInputs: DeviceInputValue[];
    allCurrentInputs: DeviceInputValue[];
};

function currentInputsChangedDataCheckCallback(
    ...[
        previousInputDevices,
        latestInputDevices,
    ]: Parameters<EventDataCheckCallback<CurrentInputsChangedOutput>>
): ReturnType<EventDataCheckCallback<CurrentInputsChangedOutput>> {
    const allLatestInputs = allInputDevicesToAllInputs(latestInputDevices);

    const allPreviousInputs = previousInputDevices
        ? allInputDevicesToAllInputs(previousInputDevices)
        : [];

    if (areJsonEqual(allPreviousInputs, allLatestInputs)) {
        return undefined;
    } else {
        const newInputs = allLatestInputs.filter((latestInput) => {
            return !allPreviousInputs.find((previousInput) => {
                previousInput.inputName === latestInput.inputName;
            });
        });
        const removedInputs = allPreviousInputs.filter((latestInput) => {
            return !allLatestInputs.find((previousInput) => {
                previousInput.inputName === latestInput.inputName;
            });
        });

        return {
            newInputs,
            removedInputs,
            allCurrentInputs: allLatestInputs,
        };
    }
}

export class CurrentInputsChangedEvent extends defineTimedEvent<CurrentInputsChangedOutput>()(
    InputDeviceHandlerEventTypeEnum.CurrentInputsChanged,
    currentInputsChangedDataCheckCallback,
) {}
