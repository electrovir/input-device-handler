import {randomString} from '@augment-vir/browser';
import {typedAssertNotNullish} from '@augment-vir/browser-testing';
import {getObjectTypedValues} from '@augment-vir/common';
import {assert} from '@open-wc/testing';
import {sendKeys} from '@web/test-runner-commands';
import {createButtonName} from '../device/gamepad/gamepad-input-names';
import {EventsMap} from './event-util/all-events';
import {InputDeviceHandlerEventTypeEnum} from './event-util/event-types';
import {CurrentInputsChangedEvent} from './events/current-inputs-changed.event';
import {InputDeviceHandler} from './input-device-handler';

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

    function setupInstanceForTesting(): Readonly<{
        instance: InputDeviceHandler;
        events: Readonly<Partial<EventsMap>>;
    }> {
        const instance = new InputDeviceHandler({
            skipLoopStart: true,
        });

        const events: Partial<EventsMap> = {};

        instance.addEventListener(InputDeviceHandlerEventTypeEnum.AllDevicesUpdated, (event) => {
            if (!events[InputDeviceHandlerEventTypeEnum.AllDevicesUpdated]) {
                events[InputDeviceHandlerEventTypeEnum.AllDevicesUpdated] = [];
            }
            events[InputDeviceHandlerEventTypeEnum.AllDevicesUpdated]!.push(event);
        });
        instance.addEventListener(InputDeviceHandlerEventTypeEnum.CurrentInputsChanged, (event) => {
            if (!events[InputDeviceHandlerEventTypeEnum.CurrentInputsChanged]) {
                events[InputDeviceHandlerEventTypeEnum.CurrentInputsChanged] = [];
            }
            events[InputDeviceHandlerEventTypeEnum.CurrentInputsChanged]!.push(event);
        });
        instance.addEventListener(InputDeviceHandlerEventTypeEnum.NewDevicesAdded, (event) => {
            if (!events[InputDeviceHandlerEventTypeEnum.NewDevicesAdded]) {
                events[InputDeviceHandlerEventTypeEnum.NewDevicesAdded] = [];
            }
            events[InputDeviceHandlerEventTypeEnum.NewDevicesAdded]!.push(event);
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

    it('should not fire events before running an update', async () => {
        const {events} = setupInstanceForTesting();

        await pressDownRandomKey();

        assert.isEmpty(
            getObjectTypedValues(events),
            'events should not be fired before an any updates even after pressing inputs',
        );
    });

    it('should fire events after running an update', async () => {
        const {events, instance} = setupInstanceForTesting();

        instance.updateInputDevices();

        assert.isNotEmpty(
            getObjectTypedValues(events),
            'events should not be fired before an any updates',
        );
        assert.strictEqual(
            getObjectTypedValues(events).length,
            2,
            'should have an entry for two of the events',
        );
    });

    function getInputChangedEventAt(
        events: Readonly<Partial<EventsMap>>,
        index: number,
    ): CurrentInputsChangedEvent {
        const inputChangedEvents = events[InputDeviceHandlerEventTypeEnum.CurrentInputsChanged];
        assert(inputChangedEvents);
        const inputChangedEvent = inputChangedEvents[index];
        typedAssertNotNullish(inputChangedEvent, `event at "${index}" should've existed`);

        return inputChangedEvent;
    }

    it('should fire an input changed event after pressing a key', async () => {
        const {events, instance} = setupInstanceForTesting();

        const pressedKey = await pressDownRandomKey();

        instance.updateInputDevices();

        assert.strictEqual(getObjectTypedValues(events).length, 3);
        const inputChangedEvent = getInputChangedEventAt(events, 0);
        assert.deepStrictEqual(
            inputChangedEvent.detail.data.newInputs,
            inputChangedEvent.detail.data.allCurrentInputs,
        );
        assert.strictEqual(inputChangedEvent.detail.data.allCurrentInputs.length, 1);
        const newInput = inputChangedEvent.detail.data.allCurrentInputs[0];
        typedAssertNotNullish(newInput);
        assert.strictEqual(newInput.inputName, createButtonName(pressedKey));
    });

    it('should fire an input changed event after releasing key', async () => {
        const {events, instance} = setupInstanceForTesting();

        const pressedKey = await pressDownRandomKey();

        instance.updateInputDevices();

        await sendKeys({
            up: pressedKey,
        });

        instance.updateInputDevices();

        assert.strictEqual(getObjectTypedValues(events).length, 3);
        const inputChangedEvent = getInputChangedEventAt(events, 1);
        assert.deepStrictEqual(
            inputChangedEvent.detail.data.newInputs,
            inputChangedEvent.detail.data.allCurrentInputs,
        );
        assert.isEmpty(inputChangedEvent.detail.data.newInputs);
        assert.isEmpty(inputChangedEvent.detail.data.allCurrentInputs);
        assert.strictEqual(inputChangedEvent.detail.data.removedInputs.length, 1);
        const removedInput = inputChangedEvent.detail.data.removedInputs[0];
        typedAssertNotNullish(removedInput);
        assert.strictEqual(removedInput.inputName, createButtonName(pressedKey));
    });
});
