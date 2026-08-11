import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {createAxeName, createButtonName} from './input-names.js';

describe(createButtonName.name, () => {
    it('produces correct button names', () => {
        /**
         * These test inputs are strange and will theoretically never actually happen where this
         * function is used. However, we are testing them here just to see what happens.
         */
        const weirdTestCases = [
            {
                input: -Infinity,
                expect: 'button--Infinity',
            },
            {
                input: -2,
                expect: 'button--2',
            },
            {
                input: NaN,
                expect: 'button-NaN',
            },
            {
                input: 87.4,
                expect: 'button-87.4',
            },
        ];

        const buttonIndexTestCases = [
            {
                input: 5,
                expect: 'button-5',
            },
            {
                input: 0,
                expect: 'button-0',
            },
        ].concat(weirdTestCases);

        buttonIndexTestCases.forEach((testCase) => {
            assert.strictEquals(createButtonName(testCase.input), testCase.expect);
        });
    });
});

describe(createAxeName.name, () => {
    it('produces correct axe names', () => {
        /**
         * These test inputs are strange and will theoretically never actually happen where this
         * function is used. However, we are testing them here just to see what happens.
         */
        const weirdTestCases = [
            {
                input: -Infinity,
                expect: 'axe--Infinity',
            },
            {
                input: -2,
                expect: 'axe--2',
            },
            {
                input: NaN,
                expect: 'axe-NaN',
            },
            {
                input: 87.4,
                expect: 'axe-87.4',
            },
        ];

        const axeIndexTestCases = [
            {
                input: 5,
                expect: 'axe-5',
            },
            {
                input: 0,
                expect: 'axe-0',
            },
        ].concat(weirdTestCases);

        axeIndexTestCases.forEach((testCase) => {
            assert.strictEquals(createAxeName(testCase.input), testCase.expect);
        });
    });
});
