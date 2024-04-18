import {isGamepadDeviceKey} from '../input-device-key';
import {InputDeviceType} from '../input-device-type';
import {DeviceInputValue, GamepadInputValue} from '../input-value';
import {AllGamepadDeadZoneSettings} from './dead-zone-settings';
import {getSerializedGamepads} from './navigator';
import {GamepadMap, SerializedGamepad} from './serialized-gamepad';

/**
 * Read and serialize all gamepads.
 *
 * @category Internal
 */
export function readCurrentGamepads({
    deadZoneSettings,
    globalDeadZone,
}: Readonly<{
    deadZoneSettings: Readonly<AllGamepadDeadZoneSettings>;
    globalDeadZone: number;
}>): GamepadMap {
    const gamepads = getSerializedGamepads({deadZoneSettings, globalDeadZone});

    const gamepadMap: GamepadMap = gamepads.reduce((mapping, gamepad) => {
        const gamepadKey = gamepad.index;

        if (!isGamepadDeviceKey(gamepadKey)) {
            console.warn(`ignoring gamepad index '${gamepadKey}'`);
            return mapping;
        }

        mapping[gamepadKey] = gamepad;
        return mapping;
    }, {} as GamepadMap);

    return gamepadMap;
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
        deviceKey: gamepad.index,
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
