import {typedObjectFromEntries} from '@augment-vir/common';
import {isRunTimeType} from 'run-time-assertions';
import {GamepadInputDeviceKey, isGamepadDeviceKey} from '../input-device-key';
import {DeviceInputType, createAxeName, createButtonName} from '../input-names';
import {AllGamepadDeadZoneSettings, GamepadDeadZones, applyDeadZone} from './dead-zone-settings';

/**
 * A single input from a gamepad.
 *
 * @category Types
 */
export type SerializedGamepadInput = Readonly<{
    /** The standardized name of the input, which includes the input type. */
    inputName: string;
    /** The current input's value masked by any dead zone settings. */
    value: number;
    inputType: DeviceInputType;
}>;

/**
 * All current serialized gamepad inputs grouped by their input type.
 *
 * @category Types
 */
export type SerializedGamepadInputs = Readonly<{
    axes: ReadonlyArray<Readonly<SerializedGamepadInput>>;
    buttons: ReadonlyArray<Readonly<SerializedGamepadInput>>;
}>;

/**
 * All a gamepad's information serialized into a pure JSON object.
 *
 * @category Types
 */
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

/**
 * Serialize an input from a Gamepad API gamepad.
 *
 * @category Internal
 */
export function serializeGamepadInput({
    gamepadInput,
    inputIndex,
    deadZones,
    globalDeadZone,
}: Readonly<{
    gamepadInput: Readonly<GamepadButton> | number;
    inputIndex: number;
    deadZones: Readonly<GamepadDeadZones>;
    globalDeadZone: number;
}>): SerializedGamepadInput {
    const isAxe = isRunTimeType(gamepadInput, 'number');
    const inputName = isAxe ? createAxeName(inputIndex) : createButtonName(inputIndex);
    const value: number = isAxe ? gamepadInput : gamepadInput.value;

    return {
        inputName,
        value: applyDeadZone({value, gamepadDeadZone: deadZones[inputName], globalDeadZone}),
        inputType: isAxe ? DeviceInputType.Axe : DeviceInputType.Button,
    };
}

/**
 * An object of gamepad keys to their serialized objects.
 *
 * @category Internal
 */
export type GamepadMap = Record<GamepadInputDeviceKey, SerializedGamepad>;

/**
 * Serialize a gamepad from a Gamepad API.
 *
 * @category Internal
 */
export function serializeGamepad({
    gamepad,
    deadZoneSettings,
    globalDeadZone,
}: Readonly<{
    gamepad: Readonly<Gamepad>;
    deadZoneSettings: Readonly<AllGamepadDeadZoneSettings>;
    globalDeadZone: number;
}>): SerializedGamepad {
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
