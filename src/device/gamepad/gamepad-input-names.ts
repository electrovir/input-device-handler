export function createButtonName(buttonIndexOrName: number | string): string {
    return `button-${buttonIndexOrName}`;
}

export function createAxeName(axeNameOrIndex: number | string): string {
    return `axe-${axeNameOrIndex}`;
}

export function parseGamepadInputName(
    inputName: string,
): {inputType: 'axe' | 'button'; inputIndex: number} | undefined {
    const [
        type,
        rawIndex,
    ] = inputName.split('-');
    const index = Number(rawIndex);
    if ((type === 'button' || type === 'axe') && !isNaN(index)) {
        return {
            inputType: type,
            inputIndex: index,
        };
    } else {
        return undefined;
    }
}
