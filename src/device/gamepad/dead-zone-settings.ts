export type GamepadDeadZoneSettings = Readonly<{
    [deviceName: string]: {
        [
            inputName: string
        ]: /** The minimum value, in either direction for an input to be considered as triggering an action. */
        number;
    };
}>;
