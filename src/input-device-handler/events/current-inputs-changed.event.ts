import {areJsonEqual} from '@augment-vir/common';
import {allInputDevicesToAllInputs} from '../../device/all-input-devices';
import {DeviceInputValue} from '../../device/input-value';
import {ConstructEventIfDataIsNew, DeviceHandlerEventTypeEnum} from '../event-util/event-types';
import {defineTimedEvent} from '../event-util/timed-event';

export type CurrentInputsChangedOutput = {
    newInputs: DeviceInputValue[];
    removedInputs: DeviceInputValue[];
    allCurrentInputs: DeviceInputValue[];
};

function areInputsEqual(a: DeviceInputValue, b: DeviceInputValue) {
    return (
        a.deviceKey === b.deviceKey &&
        a.inputName === b.inputName &&
        a.inputName === b.inputName &&
        a.inputValue === b.inputValue
    );
}

function didCurrentInputsChange(
    ...[
        previousInputDevices,
        latestInputDevices,
    ]: Parameters<ConstructEventIfDataIsNew<CurrentInputsChangedOutput>>
): ReturnType<ConstructEventIfDataIsNew<CurrentInputsChangedOutput>> {
    const allLatestInputs = allInputDevicesToAllInputs(latestInputDevices);

    const allPreviousInputs = previousInputDevices
        ? allInputDevicesToAllInputs(previousInputDevices)
        : [];

    if (areJsonEqual(allPreviousInputs, allLatestInputs)) {
        return undefined;
    } else {
        const newInputs = allLatestInputs.filter((latestInput) => {
            return !allPreviousInputs.find((previousInput) => {
                return areInputsEqual(previousInput, latestInput);
            });
        });
        const removedInputs = allPreviousInputs.filter((latestInput) => {
            return !allLatestInputs.find((previousInput) => {
                return areInputsEqual(previousInput, latestInput);
            });
        });

        return {
            newInputs,
            removedInputs,
            allCurrentInputs: allLatestInputs,
        };
    }
}

export const CurrentInputsChangedEvent = defineTimedEvent<CurrentInputsChangedOutput>()(
    DeviceHandlerEventTypeEnum.CurrentInputsChanged,
    didCurrentInputsChange,
);
export type CurrentInputsChangedEvent = InstanceType<typeof CurrentInputsChangedEvent>;
