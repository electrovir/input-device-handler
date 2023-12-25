import {isEnumValue} from '@augment-vir/common';
import {GamepadInputType} from './gamepad-input-type';
export function createButtonName(buttonIndexOrName: number | string): string {
    return `button-${buttonIndexOrName}`;
}

export function createAxeName(axeNameOrIndex: number | string): string {
    return `axe-${axeNameOrIndex}`;
}

export function parseGamepadInputName(
    inputName: string,
): {inputType: GamepadInputType; inputIndex: number} | undefined {
    const [
        inputType,
        rawIndex,
    ] = inputName.split('-');
    const inputIndex = Number(rawIndex);
    if (isEnumValue(inputType, GamepadInputType) && !isNaN(inputIndex)) {
        return {
            inputType,
            inputIndex,
        };
    } else {
        return undefined;
    }
}
