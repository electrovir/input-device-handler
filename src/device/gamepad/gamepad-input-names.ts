export type ButtonName = `button-${number | string}`;
export type AxeName = `axe-${number | string}`;

export type InputName = ButtonName | AxeName;

export function createButtonName(buttonIndexOrName: number | string): ButtonName {
    return `button-${buttonIndexOrName}`;
}
export function createAxeName(axeNameOrIndex: number | string): AxeName {
    return `axe-${axeNameOrIndex}`;
}
