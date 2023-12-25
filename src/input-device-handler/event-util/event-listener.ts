import {MaybePromise} from '@augment-vir/common';
import {ExtractEventByType} from 'typed-event-target';
import {AnyDeviceHandlerEvent} from './all-events';
import {DeviceHandlerEventTypeEnum} from './event-types';

export type AnyDeviceHandlerListener = (event: AnyDeviceHandlerEvent) => MaybePromise<void>;
export type DeviceHandlerListener<EventType extends DeviceHandlerEventTypeEnum> = (
    event: ExtractEventByType<AnyDeviceHandlerEvent, EventType>,
) => MaybePromise<void>;
