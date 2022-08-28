export type GamepadDeadZoneSettings = Readonly<
    Record<
        string,
        {
            axesDeadZones: Readonly<Record<number, number>>;
            /**
             * Button dead zones are applicable to pressure sensitive buttons, like triggers. Note
             * that sometimes pressure sensitive buttons map to axes instead of buttons.
             */
            buttonDeadZones: Readonly<Record<number, number>>;
        }
    >
>;
