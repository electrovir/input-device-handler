import {check} from '@augment-vir/assert';
import {allInputDevicesToAllInputs} from '../../device/all-input-devices.js';
import {DeviceInputValue} from '../../device/input-value.js';
import {ConstructEventIfDataIsNew, defineTimedEvent} from '../event-util/timed-event.js';

/**
 * The data contained within a `CurrentInputsChangedEvent` event.
 *
 * @category Events
 */
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

    if (check.jsonEquals(allPreviousInputs as unknown, allLatestInputs as unknown)) {
        return undefined;
    } else {
        const newInputs = allLatestInputs.filter((latestInput) => {
            return !allPreviousInputs.some((previousInput) => {
                return areInputsEqual(previousInput, latestInput);
            });
        });
        const removedInputs = allPreviousInputs.filter((latestInput) => {
            return !allLatestInputs.some((previousInput) => {
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

/**
 * This event is triggered any time the inputs to any device change. Meaning, any frame wherein a
 * device input value differs from the last frame's value for that same input, this event will
 * fire.
 *
 * @category Events
 */
export const CurrentInputsChangedEvent = defineTimedEvent<CurrentInputsChangedOutput>()(
    'current-inputs-changed',
    didCurrentInputsChange,
);
/**
 * Type for `CurrentInputsChangedEvent` because it's a faked class.
 *
 * @category Internal
 */
export type CurrentInputsChangedEvent = InstanceType<typeof CurrentInputsChangedEvent>;
