import {InputDeviceHandler} from '..';

const deviceHandler = new InputDeviceHandler({
    skipLoopStart: true,
});

function myRenderLoop() {
    const currentDevices = deviceHandler.updateInputDevices();
    // do something with the current devices and their inputs...
    requestAnimationFrame(myRenderLoop);
}

myRenderLoop();
