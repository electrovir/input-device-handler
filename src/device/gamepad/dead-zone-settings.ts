export type GamepadDeadZones = Readonly<{
    [
        inputName: string
    ]: /** The minimum value, in either direction for an input to be considered as triggering an action. */
    number;
}>;

export type AllGamepadDeadZoneSettings = Readonly<{
    [deviceName: string]: GamepadDeadZones;
}>;

const defaultDeadZone = 0.01;

export function applyDeadZone({
    value,
    gamepadDeadZone,
    globalDeadZone,
}: {
    value: number;
    gamepadDeadZone: number | undefined;
    globalDeadZone: number;
}) {
    const finalDeadZone = gamepadDeadZone ?? (globalDeadZone || defaultDeadZone);

    return Math.abs(value) > finalDeadZone ? value : 0;
}
