var J=Object.defineProperty;var U=(e,t,n)=>t in e?J(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var u=(e,t,n)=>(U(e,typeof t!="symbol"?t+"":t,n),n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();const _=[(e,t)=>t in e,(e,t)=>t in e.constructor.prototype];function X(e,t){return e?_.some(n=>{try{return n(e,t)}catch{return!1}}):!1}function Y(e){let t;try{t=Reflect.ownKeys(e)}catch{}return t??[...Object.keys(e),...Object.getOwnPropertySymbols(e)]}var O;(function(e){e.Upper="upper",e.Lower="lower"})(O||(O={}));var P;(function(e){e.FirstThenWait="first-then-wait",e.AfterWait="after-wait"})(P||(P={}));function Q(e){return e?e instanceof Error?e.message:X(e,"message")?String(e.message):String(e):""}function x(e){return!!e&&typeof e=="object"}function ee(){return globalThis.crypto?globalThis.crypto:require("crypto").webcrypto}ee();function te(e){return e===null?"null":Array.isArray(e)?"array":typeof e}function T(e,t){return te(e)===t}class ne extends Error{constructor(t){super(`Failed to compare objects using JSON.stringify: ${t}`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"JsonStringifyError"})}}function N(e,t){return JSON.stringify(e)===JSON.stringify(t)}function z(e,t){try{if(e===t||N(e,t))return!0;if(x(e)&&x(t)){const n=Object.keys(e).sort(),s=Object.keys(t).sort();if(n.length||s.length)return N(n,s)?Y(e).every(i=>z(e[i],t[i])):!1}return N(e,t)}catch(n){throw new ne(Q(n))}}const re=[(e,t)=>t in e,(e,t)=>t in e.constructor.prototype];function g(e,t){return e?re.some(n=>{try{return n(e,t)}catch{return!1}}):!1}function m(e){let t;try{t=Reflect.ownKeys(e)}catch{}return t??[...Object.keys(e),...Object.getOwnPropertySymbols(e)]}function I(e){return m(e).map(t=>e[t])}function se(e){return Object.fromEntries(e)}function h(e){return!!e}const ie={capitalizeFirstLetter:!1};function oe(e){return e.length?e[0].toUpperCase()+e.slice(1):""}function ae(e,t){return t.capitalizeFirstLetter?oe(e):e}function ue(e,t=ie){const n=e.toLowerCase();if(!n.length)return"";const s=n.replace(/^-+/,"").replace(/-{2,}/g,"-").replace(/-(?:.|$)/g,r=>{const i=r[1];return i?i.toUpperCase():""});return ae(s,t)}var A;(function(e){e.Upper="upper",e.Lower="lower"})(A||(A={}));var C;(function(e){e.FirstThenWait="first-then-wait",e.AfterWait="after-wait"})(C||(C={}));function ce(e,t){let n=!1;const s=m(e).reduce((r,i)=>{const o=t(i,e[i],e);return o instanceof Promise&&(n=!0),{...r,[i]:o}},{});return n?new Promise(async(r,i)=>{try{await Promise.all(m(s).map(async o=>{const a=await s[o];s[o]=a})),r(s)}catch(o){i(o)}}):s}function le(){return globalThis.crypto?globalThis.crypto:require("crypto").webcrypto}le();const F={gamepad1:0,gamepad2:1,gamepad3:2,gamepad4:3};function S(e){return Object.values(F).includes(e)}const de={mouse:"mouse",keyboard:"keyboard"},d={...de,...F};var l=(e=>(e.Keyboard="keyboard",e.Mouse="mouse",e.Gamepad="gamepad",e))(l||{}),L=(e=>(e.Button="button",e.Axe="axe",e))(L||{});function f(e){return`button-${e}`}function D(e){return`axe-${e}`}const pe=.01;function fe({value:e,gamepadDeadZone:t,globalDeadZone:n}){const s=t??(n||pe);return Math.abs(e)>s?e:0}function M({gamepadInput:e,inputIndex:t,deadZones:n,globalDeadZone:s}){const r=T(e,"number"),i=r?D(t):f(t),o=r?e:e.value;return{inputName:i,value:fe({value:o,gamepadDeadZone:n[i],globalDeadZone:s}),inputType:r?L.Axe:L.Button}}function me({gamepad:e,deadZoneSettings:t,globalDeadZone:n}){if(!S(e.index))throw new Error(`Tried to serialize gamepad with out-of-bounds index: '${e.index}'`);const s=t[e.id]||{},r=e.axes.map((a,c)=>M({gamepadInput:a,inputIndex:c,deadZones:s,globalDeadZone:n})),i=e.buttons.map((a,c)=>M({deadZones:s,gamepadInput:a,globalDeadZone:n,inputIndex:c})),o=se([...i,...r].map(a=>[a.inputName,a]));return{axes:r,buttons:i,isConnected:e.connected,gamepadName:e.id,index:e.index,mapping:e.mapping,serialized:!0,timestamp:e.timestamp,inputsByName:o}}const y=window.navigator;function ye({deadZoneSettings:e,globalDeadZone:t}){return Array.from(g(y,"webkitGetGamepads")?y.webkitGetGamepads():g(y,"getGamepads")?y.getGamepads():[]).filter(n=>!!n).map(n=>me({gamepad:n,deadZoneSettings:e,globalDeadZone:t}))}function ve({deadZoneSettings:e,globalDeadZone:t}){return ye({deadZoneSettings:e,globalDeadZone:t}).reduce((r,i)=>{const o=i.index;return S(o)?(r[o]=i,r):(console.warn(`ignoring gamepad index '${o}'`),r)},{})}function ge(e){const t={},n={deviceKey:e.index,deviceName:e.gamepadName,deviceType:l.Gamepad};return Object.values(e.inputsByName).forEach(s=>{s.value&&(t[s.inputName]={...n,details:s,inputName:s.inputName,inputValue:s.value})}),t}function he(e){return ce(e,(t,n)=>({currentInputs:ge(n),deviceDetails:n,deviceName:n.gamepadName,deviceKey:n.index,deviceType:l.Gamepad}))}function j(e){return I(e).map(s=>s==null?void 0:s.currentInputs).filter(h).map(s=>I(s)).flat()}var be=globalThis&&globalThis.__setFunctionName||function(e,t,n){return typeof t=="symbol"&&(t=t.description?"[".concat(t.description,"]"):""),Object.defineProperty(e,"name",{configurable:!0,value:n?"".concat(n," ",t):t})};function we(){return class extends Event{constructor(t,n){super(t,n),Object.defineProperty(this,"detail",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.detail=n.detail}}}const Ne=globalThis.CustomEvent||we();function Te(){function e(t){var n;return n=class extends Ne{constructor(r){super(t,r)}},be(n,"TypedEventConstructor"),Object.defineProperty(n,"type",{enumerable:!0,configurable:!0,writable:!0,value:t}),n}return e}globalThis&&globalThis.__setFunctionName;function Ie(e){let t;try{t=Reflect.ownKeys(e)}catch{}return t??[...Object.keys(e),...Object.getOwnPropertySymbols(e)]}function G(e){return Ie(e).map(t=>e[t])}var Z;(function(e){e.Upper="upper",e.Lower="lower"})(Z||(Z={}));var R;(function(e){e.FirstThenWait="first-then-wait",e.AfterWait="after-wait"})(R||(R={}));function Le(){return globalThis.crypto?globalThis.crypto:require("crypto").webcrypto}Le();class De{constructor(){Object.defineProperty(this,"listeners",{enumerable:!0,configurable:!0,writable:!0,value:{}})}getListenerCount(){return G(this.listeners).map(n=>(n==null?void 0:n.size)||0).reduce((n,s)=>n+s,0)}listen(t,n,s={}){const r=this.listeners,i=T(t,"string")?t:t.type;function o(){var c;return((c=r[i])==null?void 0:c.delete(n))||!1}function a(c,K){s.once&&o(),n(c,K)}return r[i]||(r[i]=new Map),r[i].set(n,{listener:a,removeListener:o}),o}removeListener(t,n){const s=T(t,"string")?t:t.type,r=this.listeners[s];if(!r)return!1;const i=r.get(n);return i?i.removeListener():!1}dispatch(t){const n=this.listeners[t.type],s=(n==null?void 0:n.size)||0;return n==null||n.forEach(r=>{r.listener(t,r.removeListener)}),s}removeAllListeners(){const n=G(this.listeners).reduce((s,r)=>{const i=(r==null?void 0:r.size)||0;return r==null||r.clear(),s+i},0);return this.listeners={},n}destroy(){this.removeAllListeners()}}function Ee(e,t,n,s){return e.addEventListener(t,n,s),()=>e.removeEventListener(t,n,s)}function p(e,t,n){return Ee(globalThis,e,t,n)}function b(){return(e,t)=>{var r;const n=ue(e,{capitalizeFirstLetter:!0}),s=(r=class extends Te()(e){constructor(){super(...arguments);u(this,"eventType",e)}static constructIfDataIsNew(o,...a){const c=s.getNewData(...a);if(c)return new s({detail:{timestamp:o,inputs:c}})}},u(r,"getNewData",t),r);return Object.defineProperty(s,"name",{value:n,writable:!0}),s}}function V(e,t){return e.deviceKey===t.deviceKey&&e.inputName===t.inputName&&e.inputName===t.inputName&&e.inputValue===t.inputValue}function Ke(...[e,t]){const n=j(t),s=e?j(e):[];if(!z(s,n)){const r=n.filter(o=>!s.find(a=>V(a,o))),i=s.filter(o=>!n.find(a=>V(a,o)));return{newInputs:r,removedInputs:i,allCurrentInputs:n}}}const q=b()("current-inputs-changed",Ke);function Oe(...[e,t]){if(!e)return[];const n=m(e).filter(s=>!g(t,s));if(n.length)return n.map(s=>e[s]).filter(h)}const B=b()("devices-removed",Oe);function Pe(...[e,t]){if(!e)return I(t).filter(h);const n=m(t).filter(s=>!g(e,s));if(n.length)return n.map(s=>t[s]).filter(h)}const W=b()("new-devices-added",Pe),$={deviceDetails:void 0,deviceKey:d.keyboard,deviceName:"keyboard",deviceType:l.Keyboard},v={deviceDetails:void 0,deviceKey:d.mouse,deviceName:"mouse",deviceType:l.Mouse};function xe(...[e,t]){return t}const Ae=b()("all-devices-updated",xe),H=[Ae,W,B,q];Object.fromEntries(H.map(e=>[e.type,e]));const k="code";class Ce extends De{constructor(n={}){super();u(this,"currentKeyboardInputs",{});u(this,"currentMouseInputs",{});u(this,"gamepadDeadZoneSettings",{});u(this,"lastReadInputDevices");u(this,"loopIsRunning",!1);u(this,"globalDeadZone",0);u(this,"removeGlobalListeners",()=>{});u(this,"currentLoopIndex",-1);u(this,"lastEventDetails",{});n.gamepadDeadZoneSettings&&this.updateGamepadDeadZoneSettings(n.gamepadDeadZoneSettings),n.globalDeadZone&&(this.globalDeadZone=n.globalDeadZone),this.attachWindowListeners(n),this.readAllDevices(),n.startLoopImmediately&&this.startPollingLoop()}attachWindowListeners(n){const s=[p("keydown",r=>{const i=f(r[k]);if(this.currentKeyboardInputs.hasOwnProperty(i))return;const o={deviceType:l.Keyboard,details:{keyboardEvent:r},deviceKey:d.keyboard,deviceName:$.deviceName,inputName:i,inputValue:1};this.currentKeyboardInputs[i]=o}),p("keyup",r=>{delete this.currentKeyboardInputs[f(r[k])]}),p("mousedown",r=>{const i=f(r.button);this.currentMouseInputs.hasOwnProperty(i)||(this.currentMouseInputs[i]={deviceType:l.Mouse,details:{mouseEvent:r},deviceName:v.deviceName,deviceKey:d.mouse,inputName:i,inputValue:1})}),p("mouseup",r=>{delete this.currentMouseInputs[f(r.button)]}),n.disableMouseMovement?void 0:p("mousemove",r=>{const i=D("x"),o=D("y");this.currentMouseInputs[i]={deviceType:l.Mouse,details:{mouseEvent:r},deviceName:v.deviceName,deviceKey:d.mouse,inputName:i,inputValue:r.clientX},this.currentMouseInputs[o]={deviceType:l.Mouse,details:{mouseEvent:r},deviceName:v.deviceName,deviceKey:d.mouse,inputName:o,inputValue:r.clientY}})];this.removeGlobalListeners=()=>{s.forEach(r=>r==null?void 0:r())}}runPollingLoop(n,s){this.loopIsRunning&&this.currentLoopIndex===n&&(this.readAllDevices(this.gamepadDeadZoneSettings,s),requestAnimationFrame(r=>{this.runPollingLoop(n,r)}))}fireEvents(n,s,r){H.forEach(i=>{const o=i.constructIfDataIsNew(n,s,r);o&&(this.lastEventDetails[o.type]={constructor:i,constructorInputs:[n,s,r]},this.dispatch(o))})}getCurrentDeviceValues(n,s){const r=ve({deadZoneSettings:n,globalDeadZone:s}),i=he(r);return{[d.keyboard]:{...$,currentInputs:{...this.currentKeyboardInputs}},[d.mouse]:{...v,currentInputs:{...this.currentMouseInputs}},...i}}startPollingLoop(){this.loopIsRunning||(this.loopIsRunning=!0,this.currentLoopIndex++,requestAnimationFrame(n=>{this.runPollingLoop(this.currentLoopIndex,n)}))}pausePollingLoop(){this.loopIsRunning&&(this.loopIsRunning=!1)}getLastPollResults(){return this.lastReadInputDevices}readAllDevices(n=this.gamepadDeadZoneSettings,s=performance.now(),r=this.globalDeadZone){const i=this.getCurrentDeviceValues(n,r),o=this.lastReadInputDevices;return this.lastReadInputDevices=i,this.fireEvents(s,o,i),i}updateGamepadDeadZoneSettings(n){this.gamepadDeadZoneSettings=n}}const w=new Ce({startLoopImmediately:!0}),E=window.document.getElementById("device-names");w.listen(q,e=>{console.info("input changed:",e.detail.inputs)});w.listen(B,e=>{console.info("devices removed:",e.detail.inputs),e.detail.inputs.forEach(t=>{E.innerHTML=E.innerHTML.replace(String(t.deviceName)+"<br>","")})});w.listen(W,e=>{console.info("new devices:",e.detail.inputs),e.detail.inputs.forEach(t=>{E.innerHTML+=String(t.deviceName)+"<br>"})});console.info({instance:w});
