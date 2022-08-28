import {assert} from '@open-wc/testing';

export function assertIsNonNullable<T>(
    input: T,
    message?: string,
): asserts input is NonNullable<T> {
    assert.isDefined(input, message);
    assert.isNotNull(input, message);
}
