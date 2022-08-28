export const keyboardDeviceKeySymbol = Symbol('keyboard device id');
export const mouseDeviceKeySymbol = Symbol('mouse device id');

export type PotentialDeviceKeys =
    | number
    | typeof mouseDeviceKeySymbol
    | typeof keyboardDeviceKeySymbol;
