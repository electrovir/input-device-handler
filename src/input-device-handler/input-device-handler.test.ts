import {getObjectTypedKeys, getObjectTypedValues, randomString} from '@augment-vir/common';
import {assert} from '@open-wc/testing';
import {sendKeys} from '@web/test-runner-commands';
import {assertDefined} from 'run-time-assertions';
import {createButtonName} from '../device/input-names';
import {
    DeviceHandlerEvent,
    DeviceHandlerEventsMap,
    createEmptyDeviceHandlerEventsMap,
    deviceHandlerEventConstructorsByType,
} from './event-util/all-events';
import {AllDevicesUpdatedEvent} from './events/all-devices-updated.event';
import {CurrentInputsChangedEvent} from './events/current-inputs-changed.event';
import {InputDeviceHandler} from './input-device-handler';

function setupInstanceForTesting() {
    const instance = new InputDeviceHandler();

    const events: DeviceHandlerEventsMap = createEmptyDeviceHandlerEventsMap();

    getObjectTypedKeys(deviceHandlerEventConstructorsByType).forEach((eventType) => {
        instance.listen(eventType, (event) => {
            /**
             * Any cast is necessary here because we're working with broader types than EventsMap
             * is.
             */
            events[eventType].push(event as any);
        });
    });

    return {instance, events};
}

async function pressDownRandomKey(): Promise<string> {
    const pressedKey = randomString(1);

    await sendKeys({
        down: pressedKey,
    });

    return pressedKey;
}

function getFlattenedEvents(events: Readonly<DeviceHandlerEventsMap>): DeviceHandlerEvent[] {
    return Object.values(events).flat();
}

function getInputChangedEventAt(
    events: Readonly<DeviceHandlerEventsMap>,
    index: number,
): InstanceType<typeof CurrentInputsChangedEvent> {
    const inputChangedEvents = events[CurrentInputsChangedEvent.type];
    const inputChangedEvent = inputChangedEvents[index];
    assertDefined(inputChangedEvent, `event at '${index}' should've existed`);

    return inputChangedEvent;
}

describe(InputDeviceHandler.constructor.name, () => {
    it('should be constructable', () => {
        const instances = [
            new InputDeviceHandler({}),
            new InputDeviceHandler(),
            new InputDeviceHandler({
                gamepadDeadZoneSettings: {},
            }),
            new InputDeviceHandler({
                gamepadDeadZoneSettings: {},
            }),
        ];

        instances.forEach((instance) => assert.instanceOf(instance, InputDeviceHandler));
    });

    it('should not fire events before running an update', async () => {
        const {events} = setupInstanceForTesting();

        await pressDownRandomKey();

        assert.isEmpty(getFlattenedEvents(events), 'events should not have fired yet');
    });

    it('should fire events after running an update', async () => {
        const {events, instance} = setupInstanceForTesting();

        assert.isEmpty(
            getFlattenedEvents(events),
            'events should not have fired before calling update',
        );

        instance.readAllDevices();

        assert.lengthOf(getFlattenedEvents(events), 1, 'should fire an update event');

        instance.readAllDevices();

        const postUpdateEvents = getFlattenedEvents(events);

        assert.lengthOf(postUpdateEvents, 2, 'should fire another updated event');

        postUpdateEvents.forEach((event) => {
            assert.instanceOf(event, AllDevicesUpdatedEvent);
        });
    });

    it('should fire an input changed event after pressing a key', async () => {
        const {events, instance} = setupInstanceForTesting();

        await sendKeys({
            down: 'h',
        });

        instance.readAllDevices();

        assert.lengthOf(getFlattenedEvents(events), 2);
        const inputChangedEvent = getInputChangedEventAt(events, 0);
        assert.deepStrictEqual(
            inputChangedEvent.detail.inputs.newInputs,
            inputChangedEvent.detail.inputs.allCurrentInputs,
        );
        assert.lengthOf(inputChangedEvent.detail.inputs.allCurrentInputs, 1);
        const newInput = inputChangedEvent.detail.inputs.allCurrentInputs[0];
        assertDefined(newInput);
        assert.strictEqual(newInput.inputName, createButtonName('KeyH'));
    });

    it('should fire an input changed event after releasing key', async () => {
        const {events, instance} = setupInstanceForTesting();

        await sendKeys({
            down: 'j',
        });

        instance.readAllDevices();

        await sendKeys({
            up: 'j',
        });

        instance.readAllDevices();

        assert.lengthOf(getObjectTypedValues(events), 4);
        const inputChangedEvent = getInputChangedEventAt(events, 1);
        assert.deepStrictEqual(
            inputChangedEvent.detail.inputs.newInputs,
            inputChangedEvent.detail.inputs.allCurrentInputs,
        );
        assert.isEmpty(inputChangedEvent.detail.inputs.newInputs);
        assert.isEmpty(inputChangedEvent.detail.inputs.allCurrentInputs);
        assert.lengthOf(inputChangedEvent.detail.inputs.removedInputs, 1);
        const removedInput = inputChangedEvent.detail.inputs.removedInputs[0];
        assertDefined(removedInput);
        assert.strictEqual(removedInput.inputName, createButtonName('KeyJ'));
    });
});
