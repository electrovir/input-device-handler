import {typedObjectFromEntries} from '@augment-vir/common';
import {isRunTimeType} from 'run-time-assertions';
import {GamepadInputDeviceKey, isGamepadDeviceKey} from '../input-device-key';
import {AllGamepadDeadZoneSettings, GamepadDeadZones, applyDeadZone} from './dead-zone-settings';
import {createAxeName, createButtonName} from './gamepad-input-names';
import {GamepadInputType} from './gamepad-input-type';

export type SerializedGamepadInput = Readonly<{
    inputName: string;
    value: number;
    inputType: GamepadInputType;
}>;

export type SerializedGamepadInputs = Readonly<{
    axes: ReadonlyArray<Readonly<SerializedGamepadInput>>;
    buttons: ReadonlyArray<Readonly<SerializedGamepadInput>>;
}>;

export type SerializedGamepad = Readonly<{
    isConnected: boolean;
    gamepadName: string;
    index: GamepadInputDeviceKey;
    /** From the gamepad API itself. */
    mapping: string;
    serialized: true;
    timestamp: number;
    inputsByName: Readonly<Record<string, SerializedGamepadInput>>;
}> &
    SerializedGamepadInputs;

export function serializeGamepadInput({
    gamepadInput,
    inputIndex,
    deadZones,
    globalDeadZone,
}: {
    gamepadInput: GamepadButton | number;
    inputIndex: number;
    deadZones: GamepadDeadZones;
    globalDeadZone: number;
}): SerializedGamepadInput {
    const isAxe = isRunTimeType(gamepadInput, 'number');
    const inputName = isAxe ? createAxeName(inputIndex) : createButtonName(inputIndex);
    const value: number = isAxe ? gamepadInput : gamepadInput.value;

    return {
        inputName,
        value: applyDeadZone({value, gamepadDeadZone: deadZones[inputName], globalDeadZone}),
        inputType: isAxe ? GamepadInputType.Axe : GamepadInputType.Button,
    };
}

export type GamepadMap = Record<GamepadInputDeviceKey, SerializedGamepad>;

export function serializeGamepad({
    gamepad,
    deadZoneSettings,
    globalDeadZone,
}: {
    gamepad: Readonly<Gamepad>;
    deadZoneSettings: AllGamepadDeadZoneSettings;
    globalDeadZone: number;
}): SerializedGamepad {
    /**
     * Basically this includes everything but the haptic interfaces since those include methods
     * (which are not serializable).
     */

    if (!isGamepadDeviceKey(gamepad.index)) {
        throw new Error(`Tried to serialize gamepad with out-of-bounds index: '${gamepad.index}'`);
    }
    const gamepadDeadZones = deadZoneSettings[gamepad.id] || {};
    const axes = gamepad.axes.map((value, index) =>
        serializeGamepadInput({
            gamepadInput: value,
            inputIndex: index,
            deadZones: gamepadDeadZones,
            globalDeadZone,
        }),
    );
    const buttons = gamepad.buttons.map((gamepadButton, buttonIndex) =>
        serializeGamepadInput({
            deadZones: gamepadDeadZones,
            gamepadInput: gamepadButton,
            globalDeadZone,
            inputIndex: buttonIndex,
        }),
    );
    const inputsByName = typedObjectFromEntries(
        [
            ...buttons,
            ...axes,
        ].map((gamepadInput) => {
            return [
                gamepadInput.inputName,
                gamepadInput,
            ];
        }),
    );

    return {
        axes,
        buttons,
        isConnected: gamepad.connected,
        gamepadName: gamepad.id,
        index: gamepad.index,
        mapping: gamepad.mapping,
        serialized: true,
        timestamp: gamepad.timestamp,
        inputsByName,
    };
}
