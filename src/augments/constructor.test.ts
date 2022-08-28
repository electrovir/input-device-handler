import {ArrayElement} from 'augment-vir';
import {Constructed, Constructor} from './constructor';

describe('Constructed', () => {
    it('should get constructed type from a constructor', () => {
        const constructors = [
            RegExp,
            Error,
        ];
        const validConstructedTypes: Constructed<ArrayElement<typeof constructors>>[] = [
            new RegExp(''),
            new Error(),
        ];
        const invalidConstructedTypes: Constructed<ArrayElement<typeof constructors>>[] = [
            // @ts-expect-error
            RegExp,
            // @ts-expect-error
            Error,
            // @ts-expect-error
            '',
        ];
    });
});

describe('Constructor', () => {
    it('should get the constructor from an instance', () => {
        const instances = [
            new RegExp(''),
            new Error(),
        ];
        const validConstructors: Constructor<ArrayElement<typeof instances>>[] = [
            RegExp,
            Error,
        ];
        const invalidConstructors: Constructor<ArrayElement<typeof instances>>[] = [
            // @ts-expect-error
            new RegExp(),
            // @ts-expect-error
            new Error(),
            // @ts-expect-error
            '',
        ];
    });
});
