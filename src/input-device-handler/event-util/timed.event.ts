import {Overwrite} from 'augment-vir';
import {defineTypedCustomEvent, TypedCustomEvent, TypedCustomEventInit} from 'typed-event-target';
import {EventDataCheckCallback, InputDeviceHandlerEventTypeEnum} from './event-types';

export type TimedEventDetail<DataTypeGeneric> = {
    timestamp: number;
    data: DataTypeGeneric;
};

export type TimedEvent<
    DataTypeGeneric,
    SpecificEventTypeGeneric extends InputDeviceHandlerEventTypeEnum,
> = TypedCustomEvent<TimedEventDetail<DataTypeGeneric>, SpecificEventTypeGeneric>;

export type TimedEventConstructor<
    DataTypeGeneric,
    SpecificEventTypeGeneric extends InputDeviceHandlerEventTypeEnum,
> = (new (eventInitDict: TypedCustomEventInit<TimedEventDetail<DataTypeGeneric>>) => TimedEvent<
    DataTypeGeneric,
    SpecificEventTypeGeneric
>) &
    Overwrite<typeof Event, Pick<TimedEvent<DataTypeGeneric, SpecificEventTypeGeneric>, 'type'>> & {
        dataCheckCallback: EventDataCheckCallback<DataTypeGeneric>;
        constructIfDataDataCheckPasses: (
            timestamp: number,
            ...inputs: Parameters<EventDataCheckCallback<DataTypeGeneric>>
        ) => TimedEvent<DataTypeGeneric, SpecificEventTypeGeneric> | undefined;
    };

export function defineTimedEvent<DataTypeGeneric>() {
    return <SpecificEventTypeGeneric extends InputDeviceHandlerEventTypeEnum>(
        type: SpecificEventTypeGeneric,
        dataCallback: EventDataCheckCallback<DataTypeGeneric>,
    ) => {
        type DetailType = TimedEventDetail<DataTypeGeneric>;
        const TimedEventConstructor = class extends defineTypedCustomEvent<DetailType>()(type) {
            static readonly dataCheckCallback = dataCallback;
            static constructIfDataDataCheckPasses(
                timestamp: number,
                ...inputs: Parameters<EventDataCheckCallback<DataTypeGeneric>>
            ) {
                const dataCheckOutput = TimedEventConstructor.dataCheckCallback(...inputs);
                if (dataCheckOutput) {
                    return new TimedEventConstructor({detail: {timestamp, data: dataCheckOutput}});
                } else {
                    return undefined;
                }
            }
        };

        return TimedEventConstructor as TimedEventConstructor<
            DataTypeGeneric,
            SpecificEventTypeGeneric
        >;
    };
}
