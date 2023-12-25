import {GamepadDevice} from '../input-device';
import {parseGamepadInputName} from './gamepad-input-names';
import {SerializedGamepadButton} from './serialized-gamepad';

export function readGamepadInputByName(
    gamepad: GamepadDevice,
    inputName: string,
): undefined | number | SerializedGamepadButton {
    const parsedInput = parseGamepadInputName(inputName);
    if (!parsedInput) {
        return undefined;
    }

    const input =
        gamepad.deviceDetails[parsedInput.inputType === 'axe' ? 'axes' : 'buttons'][
            parsedInput.inputIndex
        ];

    return input;
}
