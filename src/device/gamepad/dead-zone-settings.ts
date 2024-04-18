/**
 * Settings for dead zones by input name.
 *
 * @category Types
 */
export type GamepadDeadZones = Readonly<{
    [
        inputName: string
    ]: /** The minimum value, in either direction for an input to be considered for triggering an action. */
    number;
}>;

/**
 * Settings for dead zones by gamepad key.
 *
 * @category Types
 */
export type AllGamepadDeadZoneSettings = Readonly<{
    [gamepadKey in string]: GamepadDeadZones;
}>;

const defaultDeadZone = 0.01;

/**
 * Apply the given dead zone settings to the given value.
 *
 * @category Internal
 */
export function applyDeadZone({
    value,
    gamepadDeadZone,
    globalDeadZone,
}: Readonly<{
    value: number;
    gamepadDeadZone: number | undefined;
    globalDeadZone: number;
}>) {
    const finalDeadZone = gamepadDeadZone ?? (globalDeadZone || defaultDeadZone);

    return Math.abs(value) > finalDeadZone ? value : 0;
}
