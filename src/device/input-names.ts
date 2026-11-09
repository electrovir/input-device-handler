import {check} from '@augment-vir/assert';
import {safeSplit} from '@augment-vir/common';

/**
 * The different input types.
 *
 * - Buttons are typically only have values of on or off (0 or 1) , though some support pressure
 *   sensitivity.
 * - Axes are sliding scales like joysticks or triggers that intentionally support values between 0
 *   and 1.
 *
 * @category Internal
 */
export enum DeviceInputType {
    Button = 'button',
    Axe = 'axe',
}

/**
 * Convert the given button name or index into a standardized `InputDeviceHandler` button name.
 *
 * @category Internal
 */
export function createButtonName(buttonIndexOrName: number | string): string {
    return `button-${buttonIndexOrName}`;
}

/** The `KeyboardEvent.code` prefix of each modifier key, by its `KeyboardEvent.key`. */
const modifierCodePrefixes: Readonly<Record<string, string>> = {
    Alt: 'Alt',
    AltGraph: 'Alt',
    Control: 'Control',
    Meta: 'Meta',
    Shift: 'Shift',
};

/**
 * Same as `KeyboardEvent.code` but filled in for modifier keys when the browser leaves it blank,
 * which Firefox's fingerprinting protection does for some of them. The side comes from
 * `KeyboardEvent.location`, so a blank right Shift still reads as `'ShiftRight'`.
 *
 * @category Util
 */
export function getKeyCode(event: Readonly<Pick<KeyboardEvent, 'code' | 'key' | 'location'>>) {
    const modifierCodePrefix = modifierCodePrefixes[event.key];

    if ((event.code && event.code !== 'Unidentified') || !modifierCodePrefix) {
        return event.code;
    }

    return [
        modifierCodePrefix,
        event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT || event.key === 'AltGraph'
            ? 'Right'
            : 'Left',
    ].join('');
}

/**
 * Convert the given axe name or index into a standardized `InputDeviceHandler` axe name.
 *
 * @category Internal
 */
export function createAxeName(axeNameOrIndex: number | string): string {
    return `axe-${axeNameOrIndex}`;
}

/**
 * Parse the {@link DeviceInputType} from an input name.
 *
 * @category Util
 */
export function parseInputTypeFromInputName(inputName: string): DeviceInputType {
    const [deviceType] = safeSplit({
        value: inputName,
        splitter: '-',
    });

    if (check.isEnumValue(deviceType, DeviceInputType)) {
        return deviceType;
    } else {
        throw new Error(`Failed to parse input type from input named '${inputName}'`);
    }
}
