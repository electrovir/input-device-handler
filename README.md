# input-device-handler

Handles keyboard, mouse, and [gamepad inputs](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API) with a single API that treats inputs from all those devices identically so they can be used interchangeably. Also optionally converts the Gamepad API's polling paradigm into an event based paradigm.

-   example: https://electrovir.github.io/input-device-handler/
-   full docs: https://electrovir.github.io/input-device-handler/docs

# Usage

This details the most commonly used parts of teh API. For full API details, use the TypeScript types included in this package and in [the GitHub repo](https://github.com/electrovir/input-device-handler).

## Install

```bash
npm i input-device-handler
```

## Basic usage

Since the gamepad api is [poll based](<https://en.wikipedia.org/wiki/Polling_(computer_science)>) (their value must constantly be checked), a new class instance must be constructed so we can listen to events from it.

<!-- example-link: ./src/readme-examples/basic-setup.example.ts -->

```TypeScript
import {InputDeviceEventTypeEnum, InputDeviceHandler} from 'input-device-handler';

const deviceHandler = new InputDeviceHandler();

// listen to new devices connecting (such as gamepads)
deviceHandler.addEventListener(InputDeviceEventTypeEnum.NewDevicesAdded, (event) => {
    console.info('new devices added:', event.detail.inputs);
});

// listen to a change in inputs
deviceHandler.addEventListener(InputDeviceEventTypeEnum.CurrentInputsChanged, (event) => {
    console.info('inputs changed:', event.detail.inputs);
});
```

## Loop control

Under the hood, `InputDeviceHandler` is hooking into the render loop to constantly poll the gamepads. `InputDeviceHandler` provides means of controlling this polling loop:

<!-- example-link: ./src/readme-examples/loop-control.example.ts -->

```TypeScript
import {InputDeviceHandler} from 'input-device-handler';

const deviceHandler = new InputDeviceHandler({
    // create the handler without starting its polling loop
    skipLoopStart: true,
});

// start the polling loop, events will get fired now
deviceHandler.startPollingLoop();

// pause the polling loop, events will no longer get fired
deviceHandler.pausePollingLoop();
```

## Usage within a render loop

If you already have a render loop, you can instruct `InputDeviceHandler` to not start its own poll loop. You can then fire its update method to get all the same functionality but contained within your own render loop.

<!-- example-link: ./src/readme-examples/inside-render-loop.example.ts -->

```TypeScript
import {InputDeviceHandler} from 'input-device-handler';

const deviceHandler = new InputDeviceHandler({
    skipLoopStart: true,
});

function myRenderLoop() {
    const currentDevices = deviceHandler.updateInputDevices();
    // do something with the current devices and their inputs...
    requestAnimationFrame(myRenderLoop);
}

myRenderLoop();
```
