import {GamepadInputDeviceKey, isGamepadDeviceKey} from '../input-device-key';

export type SerializedGamepadButton = Readonly<{
    pressed: boolean;
    value: number;
    touched: boolean;
}>;

export type SerializedGamepadInputs = Readonly<{
    axes: readonly number[];
    buttons: readonly SerializedGamepadButton[];
}>;

export type SerializedGamepad = Readonly<{
    connected: boolean;
    id: string;
    index: GamepadInputDeviceKey;
    mapping: string;
    serialized: true;
    timestamp: number;
}> &
    SerializedGamepadInputs;

export function serializeGamepadButton(gamepadButton: GamepadButton): SerializedGamepadButton {
    return {
        pressed: gamepadButton.pressed,
        touched: gamepadButton.touched,
        value: gamepadButton.value,
    };
}

export type GamepadMap = Record<GamepadInputDeviceKey, SerializedGamepad>;

export function serializeGamepad(gamepad: Gamepad): SerializedGamepad {
    /**
     * Basically this includes everything but the haptic interfaces since those include methods
     * (which are not serializable).
     */

    if (!isGamepadDeviceKey(gamepad.index)) {
        throw new Error(`Tried to serialize gamepad with out-of-bounds index: '${gamepad.index}'`);
    }

    return {
        axes: gamepad.axes,
        buttons: gamepad.buttons.map(serializeGamepadButton),
        connected: gamepad.connected,
        id: gamepad.id,
        index: gamepad.index,
        mapping: gamepad.mapping,
        serialized: true,
        timestamp: gamepad.timestamp,
    };
}
