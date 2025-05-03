import {type MaybePromise} from '@augment-vir/common';
import {type ExtractEventByType} from 'typed-event-target';
import {type DeviceHandlerEvent, type DeviceHandlerEventType} from './all-events.js';

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
