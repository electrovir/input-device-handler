import {InputDeviceHandler} from '..';

const deviceHandler = new InputDeviceHandler();

function myRenderLoop() {
    const currentDevices = deviceHandler.readAllDevices();
    // do something with the current devices and their inputs...
    requestAnimationFrame(myRenderLoop);
}

myRenderLoop();
