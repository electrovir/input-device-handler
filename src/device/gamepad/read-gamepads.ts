import {isGamepadDeviceKey} from '../input-device-key';
import {InputDeviceTypeEnum} from '../input-device-type';
import {DeviceInputValue, GamepadInputType, GamepadInputValue} from '../input-value';
import {GamepadDeadZoneSettings} from './dead-zone-settings';
import {createAxeName, createButtonName} from './gamepad-input-names';
import {getSerializedGamepads} from './navigator';
import {GamepadMap, SerializedGamepad, SerializedGamepadInputs} from './serialized-gamepad';

export function readCurrentGamepads(
    gamepadDeadZoneSettings: GamepadDeadZoneSettings,
    globalDeadZone: number,
): GamepadMap {
    const gamepads = getSerializedGamepads();

    const gamepadMap: GamepadMap = gamepads.reduce((mapping, gamepad) => {
        const normalizedInputs = normalizeGamepadInput(
            gamepad,
            gamepadDeadZoneSettings,
            globalDeadZone,
        );

        const gamepadKey = gamepad.index;

        if (!isGamepadDeviceKey(gamepadKey)) {
            console.warn(`ignoring gamepad index '${gamepadKey}'`);
            return mapping;
        }

        mapping[gamepadKey] = {
            ...gamepad,
            ...normalizedInputs,
        };
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
        deviceName: gamepad.id,
        deviceType: InputDeviceTypeEnum.Gamepad,
    } as const;

    gamepad.buttons.forEach((button, index) => {
        if (button.value) {
            const buttonName = createButtonName(index);
            currentInputs[buttonName] = {
                ...gamepadDetails,
                details: {
                    inputType: GamepadInputType.Button,
                    buttonDetails: button,
                },
                inputName: buttonName,
                inputValue: button.value,
            };
        }
    });
    gamepad.axes.forEach((axe, index) => {
        if (axe) {
            const axeName = createAxeName(index);
            currentInputs[axeName] = {
                ...gamepadDetails,
                details: {
                    inputType: GamepadInputType.Axe,
                },
                inputName: axeName,
                inputValue: axe,
            };
        }
    });
    return currentInputs;
}

const defaultDeadZone = 0.01;

function normalizeGamepadInput(
    gamepad: SerializedGamepad,
    deadZones: GamepadDeadZoneSettings,
    globalDeadZone: number,
): SerializedGamepadInputs {
    const currentDeadZones = deadZones[gamepad.id];

    const axes: SerializedGamepadInputs['axes'] = gamepad.axes.map((axeInput, axeIndex) => {
        const deadZone: number =
            currentDeadZones?.[createAxeName(axeIndex)] ?? (globalDeadZone || defaultDeadZone);
        return Math.abs(axeInput) < deadZone ? 0 : axeInput;
    });
    const buttons: SerializedGamepadInputs['buttons'] = gamepad.buttons.map(
        (buttonInput, buttonIndex) => {
            const deadZone: number =
                currentDeadZones?.[createButtonName(buttonIndex)] ?? defaultDeadZone;
            const buttonValue: number =
                Math.abs(buttonInput.value) < deadZone ? 0 : buttonInput.value;

            return {
                ...buttonInput,
                value: buttonValue,
            };
        },
    );

    return {
        axes,
        buttons,
    };
}
