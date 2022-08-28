export type SerializedGamepadButton = Readonly<{
    pressed: boolean;
    value: number;
    touched: boolean;
}>;

export type GamepadInputs = Readonly<{
    axes: readonly number[];
    buttons: readonly SerializedGamepadButton[];
}>;

export type SerializedGamepad = Readonly<{
    connected: boolean;
    id: string;
    index: number;
    mapping: string;
    serialized: true;
    timestamp: number;
}> &
    GamepadInputs;

export function serializeGamepadButton(gamepadButton: GamepadButton): SerializedGamepadButton {
    return {
        pressed: gamepadButton.pressed,
        touched: gamepadButton.touched,
        value: gamepadButton.value,
    };
}

export type GamepadMap = Record<number, SerializedGamepad>;

export function serializeGamepad(gamepad: Gamepad): SerializedGamepad {
    // basically include everything but the haptic stuff since those include functions
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
