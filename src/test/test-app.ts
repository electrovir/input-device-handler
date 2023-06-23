import {InputDeviceHandlerEventTypeEnum} from '../input-device-handler/event-util/event-types';
import {InputDeviceHandler} from '../input-device-handler/input-device-handler';

const deviceHandler = new InputDeviceHandler({
    listenToMouseMovement: true,
});

const deviceNamesDiv = window.document.getElementById('device-names')!;

deviceHandler.addEventListener(InputDeviceHandlerEventTypeEnum.CurrentInputsChanged, (event) => {
    console.info('input changed:', event.detail.data);
});

deviceHandler.addEventListener(InputDeviceHandlerEventTypeEnum.DevicesRemoved, (event) => {
    console.info('devices removed:', event.detail.data);
    event.detail.data.forEach((inputDevice) => {
        deviceNamesDiv.innerHTML = deviceNamesDiv.innerHTML.replace(
            String(inputDevice.deviceName) + '<br>',
            '',
        );
    });
});

deviceHandler.addEventListener(InputDeviceHandlerEventTypeEnum.NewDevicesAdded, (event) => {
    console.info('new devices:', event.detail.data);
    event.detail.data.forEach((inputDevice) => {
        deviceNamesDiv.innerHTML += String(inputDevice.deviceName) + '<br>';
    });
});

// // this one spams the console, only uncomment for debugging
// deviceHandler.addEventListener(InputDeviceHandlerEventTypeEnum.AllDevicesUpdated, (event) => {
//     console.info('all devices:', event.detail.data);
// });

console.info({instance: deviceHandler});
