import {assert} from '@augment-vir/assert';
import {getObjectTypedKeys, getObjectTypedValues, randomString} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {sendKeys} from '@web/test-runner-commands';
import {createButtonName} from '../device/input-names.js';
import {
    DeviceHandlerEvent,
    DeviceHandlerEventsMap,
    createEmptyDeviceHandlerEventsMap,
    deviceHandlerEventConstructorsByType,
} from './event-util/all-events.js';
import {AllDevicesUpdatedEvent} from './events/all-devices-updated.event.js';
import {CurrentInputsChangedEvent} from './events/current-inputs-changed.event.js';
import {InputDeviceHandler} from './input-device-handler.js';

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
    assert.isDefined(inputChangedEvent, `event at '${index}' should've existed`);

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

    it('should fire events after running an update', () => {
        const {events, instance} = setupInstanceForTesting();

        assert.isEmpty(
            getFlattenedEvents(events),
            'events should not have fired before calling update',
        );

        instance.readAllDevices();

        assert.isLengthExactly(getFlattenedEvents(events), 1, 'should fire an update event');

        instance.readAllDevices();

        const postUpdateEvents = getFlattenedEvents(events);

        assert.isLengthExactly(postUpdateEvents, 2, 'should fire another updated event');

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

        assert.isLengthExactly(getFlattenedEvents(events), 2);
        const inputChangedEvent = getInputChangedEventAt(events, 0);
        assert.deepEquals(
            inputChangedEvent.detail.inputs.newInputs,
            inputChangedEvent.detail.inputs.allCurrentInputs,
        );
        assert.isLengthExactly(inputChangedEvent.detail.inputs.allCurrentInputs, 1);
        const newInput = inputChangedEvent.detail.inputs.allCurrentInputs[0];
        assert.isDefined(newInput);
        assert.strictEquals(newInput.inputName, createButtonName('KeyH'));
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

        assert.isLengthExactly(getObjectTypedValues(events), 4);
        const inputChangedEvent = getInputChangedEventAt(events, 1);
        assert.deepEquals(
            inputChangedEvent.detail.inputs.newInputs,
            inputChangedEvent.detail.inputs.allCurrentInputs,
        );
        assert.isEmpty(inputChangedEvent.detail.inputs.newInputs);
        assert.isEmpty(inputChangedEvent.detail.inputs.allCurrentInputs);
        assert.isLengthExactly(inputChangedEvent.detail.inputs.removedInputs, 1);
        const removedInput = inputChangedEvent.detail.inputs.removedInputs[0];
        assert.isDefined(removedInput);
        assert.strictEquals(removedInput.inputName, createButtonName('KeyJ'));
    });
});
