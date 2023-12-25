import {DeviceHandlerEventTypeEnum} from '../input-device-handler/event-util/event-types';
import {InputDeviceHandler} from '../input-device-handler/input-device-handler';

const deviceHandler = new InputDeviceHandler({startLoopImmediately: true});

const deviceNamesDiv = window.document.getElementById('device-names')!;

deviceHandler.listen(DeviceHandlerEventTypeEnum.CurrentInputsChanged, (event) => {
    console.info('input changed:', event.detail.inputs);
});

deviceHandler.listen(DeviceHandlerEventTypeEnum.DevicesRemoved, (event) => {
    console.info('devices removed:', event.detail.inputs);
    event.detail.inputs.forEach((inputDevice) => {
        deviceNamesDiv.innerHTML = deviceNamesDiv.innerHTML.replace(
            String(inputDevice.deviceName) + '<br>',
            '',
        );
    });
});

deviceHandler.listen(DeviceHandlerEventTypeEnum.NewDevicesAdded, (event) => {
    console.info('new devices:', event.detail.inputs);
    event.detail.inputs.forEach((inputDevice) => {
        deviceNamesDiv.innerHTML += String(inputDevice.deviceName) + '<br>';
    });
});

// // this spams the console, only uncomment for debugging
// deviceHandler.listen(InputDeviceHandlerEventTypeEnum.AllDevicesUpdated, (event) => {
//     console.info('all devices:', event.detail.inputs);
// });

console.info({instance: deviceHandler});
