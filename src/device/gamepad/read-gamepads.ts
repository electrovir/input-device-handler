import {typedHasProperty} from '@augment-vir/common';
import {isGamepadDeviceKey} from '../input-device-key';
import {InputDeviceTypeEnum} from '../input-device-type';
import {DeviceInputValue, GamepadInputType, GamepadInputValue} from '../input-value';
import {GamepadDeadZoneSettings} from './dead-zone-settings';
import {createAxeName, createButtonName} from './gamepad-input-names';
import {getNavigator} from './navigator';
import {
    GamepadMap,
    SerializedGamepad,
    SerializedGamepadInputs,
    serializeGamepad,
} from './serialized-gamepad';

export function readCurrentGamepads(gamepadDeadZoneSettings: GamepadDeadZoneSettings): GamepadMap {
    const navigator = getNavigator();

    const gamepads = Array.from(
        typedHasProperty(navigator, 'webkitGetGamepads')
            ? navigator.webkitGetGamepads()
            : navigator.getGamepads(),
    )
        .filter((gamepad): gamepad is Gamepad => !!gamepad)
        .map((gamepad) => serializeGamepad(gamepad));

    const gamepadMap: GamepadMap = gamepads.reduce((mapping, gamepad) => {
        const normalizedInputs = normalizeGamepadInput(gamepad, gamepadDeadZoneSettings);

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
): SerializedGamepadInputs {
    const currentGamepadSettings = deadZones[gamepad.id];

    const axes: SerializedGamepadInputs['axes'] = gamepad.axes.map((axeInput, axeIndex) => {
        const deadZone: number = currentGamepadSettings?.axesDeadZones[axeIndex] ?? defaultDeadZone;
        return Math.abs(axeInput) < deadZone ? 0 : axeInput;
    });
    const buttons: SerializedGamepadInputs['buttons'] = gamepad.buttons.map(
        (buttonInput, buttonIndex) => {
            const deadZone: number =
                currentGamepadSettings?.axesDeadZones[buttonIndex] ?? defaultDeadZone;
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
