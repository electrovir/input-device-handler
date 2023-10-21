import {InputDeviceEventTypeEnum} from '../input-device-handler/event-util/event-types';
import {InputDeviceHandler} from '../input-device-handler/input-device-handler';

const deviceHandler = new InputDeviceHandler();

const deviceNamesDiv = window.document.getElementById('device-names')!;

deviceHandler.addEventListener(InputDeviceEventTypeEnum.CurrentInputsChanged, (event) => {
    console.info('input changed:', event.detail.inputs);
});

deviceHandler.addEventListener(InputDeviceEventTypeEnum.DevicesRemoved, (event) => {
    console.info('devices removed:', event.detail.inputs);
    event.detail.inputs.forEach((inputDevice) => {
        deviceNamesDiv.innerHTML = deviceNamesDiv.innerHTML.replace(
            String(inputDevice.deviceName) + '<br>',
            '',
        );
    });
});

deviceHandler.addEventListener(InputDeviceEventTypeEnum.NewDevicesAdded, (event) => {
    console.info('new devices:', event.detail.inputs);
    event.detail.inputs.forEach((inputDevice) => {
        deviceNamesDiv.innerHTML += String(inputDevice.deviceName) + '<br>';
    });
});

// // this spams the console, only uncomment for debugging
// deviceHandler.addEventListener(InputDeviceHandlerEventTypeEnum.AllDevicesUpdated, (event) => {
//     console.info('all devices:', event.detail.inputs);
// });

console.info({instance: deviceHandler});
