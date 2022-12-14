import {InputDeviceHandlerEventTypeEnum} from '../input-device-handler/event-util/event-types';
import {InputDeviceHandler} from '../input-device-handler/input-device-handler';

const instance = new InputDeviceHandler();

const deviceNamesDiv = window.document.getElementById('device-names')!;

instance.addEventListener(InputDeviceHandlerEventTypeEnum.CurrentInputsChanged, (event) => {
    console.info('input changed:', event.detail.data);
});

instance.addEventListener(InputDeviceHandlerEventTypeEnum.DevicesRemoved, (event) => {
    console.info('devices removed:', event.detail.data);
    event.detail.data.forEach((inputDevice) => {
        deviceNamesDiv.innerHTML = deviceNamesDiv.innerHTML.replace(
            String(inputDevice.deviceName) + '<br>',
            '',
        );
    });
});

instance.addEventListener(InputDeviceHandlerEventTypeEnum.NewDevicesAdded, (event) => {
    console.info('new devices:', event.detail.data);
    event.detail.data.forEach((inputDevice) => {
        deviceNamesDiv.innerHTML += String(inputDevice.deviceName) + '<br>';
    });
});

// // this one spams the console, only uncomment for debugging
// instance.addEventListener(InputDeviceHandlerEventTypeEnum.AllDevicesUpdated, (event) => {
//     console.info('all devices:', event.detail.data);
// });

console.info({instance});
