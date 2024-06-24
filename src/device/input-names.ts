import {isEnumValue, typedSplit} from '@augment-vir/common';

/**
 * The different input types.
 *
 * - Buttons are typically only have values of on or off (0 or 1) , though some support pressure
 *   sensitivity.
 * - Axes are sliding scales like joysticks or triggers that intentionally support values between 0
 *   and 1.
 *
 * @category Types
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
    const [deviceType] = typedSplit(inputName, '-');

    if (isEnumValue(deviceType, DeviceInputType)) {
        return deviceType;
    } else {
        throw new Error(`Failed to parse input type from input named '${inputName}'`);
    }
}
