import {MaybePromise} from '@augment-vir/common';
import {ExtractEventByType} from 'typed-event-target';
import {DeviceHandlerEvent, DeviceHandlerEventType} from './all-events';

/**
 * A listener for any of the possible `InputDeviceHandler` events.
 *
 * @category Events
 */
export type AnyDeviceHandlerListener = (event: DeviceHandlerEvent) => MaybePromise<void>;
/**
 * A listener for a specific `InputDeviceHandler` event, as determined by the type parameter.
 *
 * @category Events
 */
export type DeviceHandlerListener<EventType extends DeviceHandlerEventType> = (
    event: ExtractEventByType<DeviceHandlerEvent, EventType>,
) => MaybePromise<void>;
