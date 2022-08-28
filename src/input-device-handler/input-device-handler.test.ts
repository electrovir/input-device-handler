import {assert, nextFrame} from '@open-wc/testing';
import {sendKeys} from '@web/test-runner-commands';
import {getObjectTypedValues} from 'augment-vir';
import {InputDeviceHandlerEventTypeEnum} from './event-util/event-types';
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

    it('should fire events', async () => {
        const instance = new InputDeviceHandler();

        const events: Partial<Record<InputDeviceHandlerEventTypeEnum, Event[]>> = {};

        instance.addEventListener(InputDeviceHandlerEventTypeEnum.AllDevicesUpdated, (event) => {
            if (!events[event.type]) {
                events[event.type] = [];
            }
            events[event.type]!.push(event);
        });
        instance.addEventListener(InputDeviceHandlerEventTypeEnum.CurrentInputsChanged, (event) => {
            if (!events[event.type]) {
                events[event.type] = [];
            }
            events[event.type]!.push(event);
        });
        instance.addEventListener(InputDeviceHandlerEventTypeEnum.NewDevicesAdded, (event) => {
            if (!events[event.type]) {
                events[event.type] = [];
            }
            events[event.type]!.push(event);
        });

        assert.isEmpty(
            getObjectTypedValues(events),
            'events should not be fired before an animation frame or inputs',
        );

        await sendKeys({
            down: 'm',
        });

        // awaiting sendKeys is sufficient in some browsers but not all
        await nextFrame();

        assert.isNotEmpty(
            getObjectTypedValues(events),
            'event should have been fired during the animation frame',
        );

        assert(getObjectTypedValues(events).length === 3);

        await nextFrame();
        assert(getObjectTypedValues(events).length === 3);
    });
});
