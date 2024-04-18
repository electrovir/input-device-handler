import {CurrentInputsChangedEvent} from '../input-device-handler/events/current-inputs-changed.event';
import {DevicesRemovedEvent} from '../input-device-handler/events/devices-removed.event';
import {NewDevicesAddedEvent} from '../input-device-handler/events/new-devices-added.event';
import {InputDeviceHandler} from '../input-device-handler/input-device-handler';

const deviceHandler = new InputDeviceHandler({startLoopImmediately: true});

const deviceNamesDiv = window.document.getElementById('device-names')!;

deviceHandler.listen(CurrentInputsChangedEvent, (event) => {
    console.info('input changed:', event.detail.inputs);
});

deviceHandler.listen(DevicesRemovedEvent, (event) => {
    console.info('devices removed:', event.detail.inputs);
    event.detail.inputs.forEach((inputDevice) => {
        deviceNamesDiv.innerHTML = deviceNamesDiv.innerHTML.replace(
            String(inputDevice.deviceName) + '<br>',
            '',
        );
    });
});

deviceHandler.listen(NewDevicesAddedEvent, (event) => {
    console.info('new devices:', event.detail.inputs);
    event.detail.inputs.forEach((inputDevice) => {
        deviceNamesDiv.innerHTML += String(inputDevice.deviceName) + '<br>';
    });
});

// // this spams the console, only uncomment for debugging
// deviceHandler.listen(InputDeviceHandlerEventType.AllDevicesUpdated, (event) => {
//     console.info('all devices:', event.detail.inputs);
// });

console.info({instance: deviceHandler});
