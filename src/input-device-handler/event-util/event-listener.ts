import {MaybePromise} from '@augment-vir/common';
import {ExtractEventByType} from 'typed-event-target';
import {AnyDeviceHandlerEvent, DeviceHandlerEventType} from './all-events';

export type AnyDeviceHandlerListener = (event: AnyDeviceHandlerEvent) => MaybePromise<void>;
export type DeviceHandlerListener<EventType extends DeviceHandlerEventType> = (
    event: ExtractEventByType<AnyDeviceHandlerEvent, EventType>,
) => MaybePromise<void>;
