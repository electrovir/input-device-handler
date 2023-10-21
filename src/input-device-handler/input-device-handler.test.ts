import {getEnumTypedValues, getObjectTypedValues, randomString} from '@augment-vir/common';
import {assert} from '@open-wc/testing';
import {sendKeys} from '@web/test-runner-commands';
import {assertDefined, assertTypeOf} from 'run-time-assertions';
import {AllDevices} from '../device/all-input-devices';
import {createButtonName} from '../device/gamepad/gamepad-input-names';
import {
    AnyInputHandlerEvent,
    InputHandlerEventsMap,
    createEmptyEventsMap,
} from './event-util/all-events';
import {InputDeviceEventTypeEnum} from './event-util/event-types';
import {AllDevicesUpdatedEvent} from './events/all-devices-updated.event';
import {CurrentInputsChangedEvent} from './events/current-inputs-changed.event';
import {InputDeviceHandler} from './input-device-handler';

function setupInstanceForTesting() {
    const instance = new InputDeviceHandler();

    const events: InputHandlerEventsMap = createEmptyEventsMap();

    getEnumTypedValues(InputDeviceEventTypeEnum).forEach((eventType) => {
        instance.addEventListener(eventType, (event) => {
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

function getFlattenedEvents(events: Readonly<InputHandlerEventsMap>): AnyInputHandlerEvent[] {
    return Object.values(events).flat();
}

function getInputChangedEventAt(
    events: Readonly<InputHandlerEventsMap>,
    index: number,
): InstanceType<typeof CurrentInputsChangedEvent> {
    const inputChangedEvents = events[InputDeviceEventTypeEnum.CurrentInputsChanged];
    const inputChangedEvent = inputChangedEvents[index];
    assertDefined(inputChangedEvent, `event at "${index}" should've existed`);

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

        const pressedKey = await pressDownRandomKey();

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
        assert.strictEqual(newInput.inputName, createButtonName(pressedKey));
    });

    it('should fire an input changed event after releasing key', async () => {
        const {events, instance} = setupInstanceForTesting();

        const pressedKey = await pressDownRandomKey();

        instance.readAllDevices();

        await sendKeys({
            up: pressedKey,
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
        assert.strictEqual(removedInput.inputName, createButtonName(pressedKey));
    });

    it('should fire an event listener immediately', () => {
        const {instance} = setupInstanceForTesting();
        const events: AnyInputHandlerEvent[] = [];

        instance.addEventListenerAndFireWithLatest(
            InputDeviceEventTypeEnum.AllDevicesUpdated,
            (event) => {
                events.push(event);

                assertTypeOf(event.detail.inputs).toEqualTypeOf<AllDevices>();
            },
        );

        assert.lengthOf(events, 1);

        instance.readAllDevices();

        assert.lengthOf(events, 2);
    });
});
