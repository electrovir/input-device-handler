export const keyboardDeviceIdSymbol = Symbol('keyboard device id');
export const mouseDeviceIdSymbol = Symbol('mouse device id');

export type PotentialDeviceIds =
    | string
    | typeof mouseDeviceIdSymbol
    | typeof keyboardDeviceIdSymbol;
