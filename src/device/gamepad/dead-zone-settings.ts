export type GamepadDeadZoneSettings = Readonly<
    Record<
        string,
        {
            axesDeadZones: Readonly<Record<number, number>>;
            buttonDeadZones: Readonly<Record<number, number>>;
        }
    >
>;
