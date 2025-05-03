import {mapObjectValues} from '@augment-vir/common';
import {InputDeviceType} from '../input-device-type.js';
import {type DeviceInputValue, type GamepadInputValue} from '../input-value.js';
import {type AllGamepadDeadZoneSettings} from './dead-zone-settings.js';
import {getGamepads} from './navigator.js';
import {type GamepadMap, type SerializedGamepad, serializeGamepad} from './serialized-gamepad.js';

/**
 * Read and serialize all gamepads.
 *
 * @category Internal
 */
export function readCurrentGamepads(
    inputReadingSettings: Readonly<{
        deadZoneSettings: Readonly<AllGamepadDeadZoneSettings>;
        globalDeadZone: number;
    }>,
): GamepadMap {
    return mapObjectValues(getGamepads(), (key, rawGamepad) => {
        return serializeGamepad({gamepad: rawGamepad, ...inputReadingSettings});
    });
}

/**
 * Read and serialize all current inputs from all gamepads.
 *
 * @category Internal
 */
export function gamepadToCurrentInputs(
    gamepad: Readonly<SerializedGamepad>,
): Record<DeviceInputValue['inputName'], GamepadInputValue> {
    const currentInputs: Record<DeviceInputValue['inputName'], GamepadInputValue> = {};

    const gamepadDetails: Pick<GamepadInputValue, 'deviceKey' | 'deviceName' | 'deviceType'> = {
        deviceKey: gamepad.deviceKey,
        deviceName: gamepad.gamepadName,
        deviceType: InputDeviceType.Gamepad,
    } as const;

    Object.values(gamepad.inputsByName).forEach((gamepadInput) => {
        if (gamepadInput.value) {
            currentInputs[gamepadInput.inputName] = {
                ...gamepadDetails,
                details: gamepadInput,
                inputName: gamepadInput.inputName,
                inputValue: gamepadInput.value,
            };
        }
    });

    return currentInputs;
}
