import {isGamepadDeviceKey} from '../input-device-key';
import {InputDeviceTypeEnum} from '../input-device-type';
import {DeviceInputValue, GamepadInputValue} from '../input-value';
import {AllGamepadDeadZoneSettings} from './dead-zone-settings';
import {getSerializedGamepads} from './navigator';
import {GamepadMap, SerializedGamepad} from './serialized-gamepad';

export function readCurrentGamepads({
    deadZoneSettings,
    globalDeadZone,
}: {
    deadZoneSettings: AllGamepadDeadZoneSettings;
    globalDeadZone: number;
}): GamepadMap {
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

export function gamepadToCurrentInputs(
    gamepad: SerializedGamepad,
): Record<DeviceInputValue['inputName'], GamepadInputValue> {
    const currentInputs: Record<DeviceInputValue['inputName'], GamepadInputValue> = {};

    const gamepadDetails: Pick<GamepadInputValue, 'deviceKey' | 'deviceName' | 'deviceType'> = {
        deviceKey: gamepad.index,
        deviceName: gamepad.gamepadName,
        deviceType: InputDeviceTypeEnum.Gamepad,
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
