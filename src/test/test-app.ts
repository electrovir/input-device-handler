/* eslint-disable sonarjs/no-commented-code */

import {CurrentInputsChangedEvent} from '../input-device-handler/events/current-inputs-changed.event.js';
import {DevicesRemovedEvent} from '../input-device-handler/events/devices-removed.event.js';
import {NewDevicesAddedEvent} from '../input-device-handler/events/new-devices-added.event.js';
import {InputDeviceHandler} from '../input-device-handler/input-device-handler.js';

const deviceHandler = new InputDeviceHandler({startLoopImmediately: true});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
