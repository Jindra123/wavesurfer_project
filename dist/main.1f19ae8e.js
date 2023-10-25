// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../node_modules/wavesurfer.js/dist/decoder.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
/** Decode an array buffer into an audio buffer */
function decode(audioData, sampleRate) {
  return __awaiter(this, void 0, void 0, function* () {
    const audioCtx = new AudioContext({
      sampleRate
    });
    const decode = audioCtx.decodeAudioData(audioData);
    return decode.finally(() => audioCtx.close());
  });
}
/** Normalize peaks to -1..1 */
function normalize(channelData) {
  const firstChannel = channelData[0];
  if (firstChannel.some(n => n > 1 || n < -1)) {
    const length = firstChannel.length;
    let max = 0;
    for (let i = 0; i < length; i++) {
      const absN = Math.abs(firstChannel[i]);
      if (absN > max) max = absN;
    }
    for (const channel of channelData) {
      for (let i = 0; i < length; i++) {
        channel[i] /= max;
      }
    }
  }
  return channelData;
}
/** Create an audio buffer from pre-decoded audio data */
function createBuffer(channelData, duration) {
  // If a single array of numbers is passed, make it an array of arrays
  if (typeof channelData[0] === 'number') channelData = [channelData];
  // Normalize to -1..1
  normalize(channelData);
  return {
    duration,
    length: channelData[0].length,
    sampleRate: channelData[0].length / duration,
    numberOfChannels: channelData.length,
    getChannelData: i => channelData === null || channelData === void 0 ? void 0 : channelData[i],
    copyFromChannel: AudioBuffer.prototype.copyFromChannel,
    copyToChannel: AudioBuffer.prototype.copyToChannel
  };
}
const Decoder = {
  decode,
  createBuffer
};
var _default = exports.default = Decoder;
},{}],"../../node_modules/wavesurfer.js/dist/fetcher.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function fetchBlob(url, progressCallback, requestInit) {
  var _a, _b;
  return __awaiter(this, void 0, void 0, function* () {
    // Fetch the resource
    const response = yield fetch(url, requestInit);
    // Read the data to track progress
    {
      const reader = (_a = response.clone().body) === null || _a === void 0 ? void 0 : _a.getReader();
      const contentLength = Number((_b = response.headers) === null || _b === void 0 ? void 0 : _b.get('Content-Length'));
      let receivedLength = 0;
      // Process the data
      const processChunk = (done, value) => __awaiter(this, void 0, void 0, function* () {
        if (done) return;
        // Add to the received length
        receivedLength += (value === null || value === void 0 ? void 0 : value.length) || 0;
        const percentage = Math.round(receivedLength / contentLength * 100);
        progressCallback(percentage);
        // Continue reading data
        return reader === null || reader === void 0 ? void 0 : reader.read().then(({
          done,
          value
        }) => processChunk(done, value));
      });
      reader === null || reader === void 0 ? void 0 : reader.read().then(({
        done,
        value
      }) => processChunk(done, value));
    }
    return response.blob();
  });
}
const Fetcher = {
  fetchBlob
};
var _default = exports.default = Fetcher;
},{}],"../../node_modules/wavesurfer.js/dist/event-emitter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/** A simple event emitter that can be used to listen to and emit events. */
class EventEmitter {
  constructor() {
    this.listeners = {};
  }
  /** Subscribe to an event. Returns an unsubscribe function. */
  on(eventName, listener) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = new Set();
    }
    this.listeners[eventName].add(listener);
    return () => this.un(eventName, listener);
  }
  /** Subscribe to an event only once */
  once(eventName, listener) {
    // The actual subscription
    const unsubscribe = this.on(eventName, listener);
    // Another subscription that will unsubscribe the actual subscription and itself after the first event
    const unsubscribeOnce = this.on(eventName, () => {
      unsubscribe();
      unsubscribeOnce();
    });
    return unsubscribe;
  }
  /** Unsubscribe from an event */
  un(eventName, listener) {
    if (this.listeners[eventName]) {
      if (listener) {
        this.listeners[eventName].delete(listener);
      } else {
        delete this.listeners[eventName];
      }
    }
  }
  /** Clear all events */
  unAll() {
    this.listeners = {};
  }
  /** Emit an event */
  emit(eventName, ...args) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(listener => listener(...args));
    }
  }
}
var _default = exports.default = EventEmitter;
},{}],"../../node_modules/wavesurfer.js/dist/player.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _eventEmitter = _interopRequireDefault(require("./event-emitter.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Player extends _eventEmitter.default {
  constructor(options) {
    super();
    if (options.media) {
      this.media = options.media;
    } else {
      this.media = document.createElement('audio');
    }
    // Controls
    if (options.mediaControls) {
      this.media.controls = true;
    }
    // Autoplay
    if (options.autoplay) {
      this.media.autoplay = true;
    }
    // Speed
    if (options.playbackRate != null) {
      this.onceMediaEvent('canplay', () => {
        if (options.playbackRate != null) {
          this.media.playbackRate = options.playbackRate;
        }
      });
    }
  }
  onMediaEvent(event, callback, options) {
    this.media.addEventListener(event, callback, options);
    return () => this.media.removeEventListener(event, callback);
  }
  onceMediaEvent(event, callback) {
    return this.onMediaEvent(event, callback, {
      once: true
    });
  }
  getSrc() {
    return this.media.currentSrc || this.media.src || '';
  }
  revokeSrc() {
    const src = this.getSrc();
    if (src.startsWith('blob:')) {
      URL.revokeObjectURL(src);
    }
  }
  setSrc(url, blob) {
    const src = this.getSrc();
    if (src === url) return;
    this.revokeSrc();
    const newSrc = blob instanceof Blob ? URL.createObjectURL(blob) : url;
    this.media.src = newSrc;
    this.media.load();
  }
  destroy() {
    this.media.pause();
    this.revokeSrc();
    this.media.src = '';
    // Load resets the media element to its initial state
    this.media.load();
  }
  /** Start playing the audio */
  play() {
    return this.media.play();
  }
  /** Pause the audio */
  pause() {
    this.media.pause();
  }
  /** Check if the audio is playing */
  isPlaying() {
    return this.media.currentTime > 0 && !this.media.paused && !this.media.ended;
  }
  /** Jumpt to a specific time in the audio (in seconds) */
  setTime(time) {
    this.media.currentTime = time;
  }
  /** Get the duration of the audio in seconds */
  getDuration() {
    return this.media.duration;
  }
  /** Get the current audio position in seconds */
  getCurrentTime() {
    return this.media.currentTime;
  }
  /** Get the audio volume */
  getVolume() {
    return this.media.volume;
  }
  /** Set the audio volume */
  setVolume(volume) {
    this.media.volume = volume;
  }
  /** Get the audio muted state */
  getMuted() {
    return this.media.muted;
  }
  /** Mute or unmute the audio */
  setMuted(muted) {
    this.media.muted = muted;
  }
  /** Get the playback speed */
  getPlaybackRate() {
    return this.media.playbackRate;
  }
  /** Set the playback speed, pass an optional false to NOT preserve the pitch */
  setPlaybackRate(rate, preservePitch) {
    // preservePitch is true by default in most browsers
    if (preservePitch != null) {
      this.media.preservesPitch = preservePitch;
    }
    this.media.playbackRate = rate;
  }
  /** Get the HTML media element */
  getMediaElement() {
    return this.media;
  }
  /** Set a sink id to change the audio output device */
  setSinkId(sinkId) {
    // See https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/setSinkId
    const media = this.media;
    return media.setSinkId(sinkId);
  }
}
var _default = exports.default = Player;
},{"./event-emitter.js":"../../node_modules/wavesurfer.js/dist/event-emitter.js"}],"../../node_modules/wavesurfer.js/dist/draggable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeDraggable = makeDraggable;
function makeDraggable(element, onDrag, onStart, onEnd, threshold = 5) {
  let unsub = () => {
    return;
  };
  if (!element) return unsub;
  const down = e => {
    // Ignore the right mouse button
    if (e.button === 2) return;
    e.preventDefault();
    e.stopPropagation();
    let startX = e.clientX;
    let startY = e.clientY;
    let isDragging = false;
    const move = e => {
      e.preventDefault();
      e.stopPropagation();
      const x = e.clientX;
      const y = e.clientY;
      if (isDragging || Math.abs(x - startX) >= threshold || Math.abs(y - startY) >= threshold) {
        const {
          left,
          top
        } = element.getBoundingClientRect();
        if (!isDragging) {
          isDragging = true;
          onStart === null || onStart === void 0 ? void 0 : onStart(startX - left, startY - top);
        }
        onDrag(x - startX, y - startY, x - left, y - top);
        startX = x;
        startY = y;
      }
    };
    const click = e => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const up = () => {
      if (isDragging) {
        onEnd === null || onEnd === void 0 ? void 0 : onEnd();
      }
      unsub();
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
    document.addEventListener('pointerleave', up);
    document.addEventListener('click', click, true);
    unsub = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.removeEventListener('pointerleave', up);
      setTimeout(() => {
        document.removeEventListener('click', click, true);
      }, 10);
    };
  };
  element.addEventListener('pointerdown', down);
  return () => {
    unsub();
    element.removeEventListener('pointerdown', down);
  };
}
},{}],"../../node_modules/wavesurfer.js/dist/renderer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _draggable = require("./draggable.js");
var _eventEmitter = _interopRequireDefault(require("./event-emitter.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Renderer extends _eventEmitter.default {
  constructor(options, audioElement) {
    super();
    this.timeouts = [];
    this.isScrolling = false;
    this.audioData = null;
    this.resizeObserver = null;
    this.isDragging = false;
    this.options = options;
    const parent = this.parentFromOptionsContainer(options.container);
    this.parent = parent;
    const [div, shadow] = this.initHtml();
    parent.appendChild(div);
    this.container = div;
    this.scrollContainer = shadow.querySelector('.scroll');
    this.wrapper = shadow.querySelector('.wrapper');
    this.canvasWrapper = shadow.querySelector('.canvases');
    this.progressWrapper = shadow.querySelector('.progress');
    this.cursor = shadow.querySelector('.cursor');
    if (audioElement) {
      shadow.appendChild(audioElement);
    }
    this.initEvents();
  }
  parentFromOptionsContainer(container) {
    let parent;
    if (typeof container === 'string') {
      parent = document.querySelector(container);
    } else if (container instanceof HTMLElement) {
      parent = container;
    }
    if (!parent) {
      throw new Error('Container not found');
    }
    return parent;
  }
  initEvents() {
    const getClickPosition = e => {
      const rect = this.wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientX - rect.left;
      const relativeX = x / rect.width;
      const relativeY = y / rect.height;
      return [relativeX, relativeY];
    };
    // Add a click listener
    this.wrapper.addEventListener('click', e => {
      const [x, y] = getClickPosition(e);
      this.emit('click', x, y);
    });
    // Add a double click listener
    this.wrapper.addEventListener('dblclick', e => {
      const [x, y] = getClickPosition(e);
      this.emit('dblclick', x, y);
    });
    // Drag
    if (this.options.dragToSeek) {
      this.initDrag();
    }
    // Add a scroll listener
    this.scrollContainer.addEventListener('scroll', () => {
      const {
        scrollLeft,
        scrollWidth,
        clientWidth
      } = this.scrollContainer;
      const startX = scrollLeft / scrollWidth;
      const endX = (scrollLeft + clientWidth) / scrollWidth;
      this.emit('scroll', startX, endX);
    });
    // Re-render the waveform on container resize
    const delay = this.createDelay(100);
    this.resizeObserver = new ResizeObserver(() => {
      delay(() => this.reRender());
    });
    this.resizeObserver.observe(this.scrollContainer);
  }
  initDrag() {
    (0, _draggable.makeDraggable)(this.wrapper,
    // On drag
    (_, __, x) => {
      this.emit('drag', Math.max(0, Math.min(1, x / this.wrapper.getBoundingClientRect().width)));
    },
    // On start drag
    () => this.isDragging = true,
    // On end drag
    () => this.isDragging = false);
  }
  getHeight() {
    const defaultHeight = 128;
    if (this.options.height == null) return defaultHeight;
    if (!isNaN(Number(this.options.height))) return Number(this.options.height);
    if (this.options.height === 'auto') return this.parent.clientHeight || defaultHeight;
    return defaultHeight;
  }
  initHtml() {
    const div = document.createElement('div');
    const shadow = div.attachShadow({
      mode: 'open'
    });
    shadow.innerHTML = `
      <style>
        :host {
          user-select: none;
        }
        :host audio {
          display: block;
          width: 100%;
        }
        :host .scroll {
          overflow-x: auto;
          overflow-y: hidden;
          width: 100%;
          position: relative;
          touch-action: none;
        }
        :host .noScrollbar {
          scrollbar-color: transparent;
          scrollbar-width: none;
        }
        :host .noScrollbar::-webkit-scrollbar {
          display: none;
          -webkit-appearance: none;
        }
        :host .wrapper {
          position: relative;
          overflow: visible;
          z-index: 2;
        }
        :host .canvases {
          min-height: ${this.getHeight()}px;
        }
        :host .canvases > div {
          position: relative;
        }
        :host canvas {
          display: block;
          position: absolute;
          top: 0;
          image-rendering: pixelated;
        }
        :host .progress {
          pointer-events: none;
          position: absolute;
          z-index: 2;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          overflow: hidden;
        }
        :host .progress > div {
          position: relative;
        }
        :host .cursor {
          pointer-events: none;
          position: absolute;
          z-index: 5;
          top: 0;
          left: 0;
          height: 100%;
          border-radius: 2px;
        }
      </style>

      <div class="scroll" part="scroll">
        <div class="wrapper" part="wrapper">
          <div class="canvases"></div>
          <div class="progress" part="progress"></div>
          <div class="cursor" part="cursor"></div>
        </div>
      </div>
    `;
    return [div, shadow];
  }
  /** Wavesurfer itself calls this method. Do not call it manually. */
  setOptions(options) {
    if (this.options.container !== options.container) {
      const newParent = this.parentFromOptionsContainer(options.container);
      newParent.appendChild(this.container);
      this.parent = newParent;
    }
    this.options = options;
    // Re-render the waveform
    this.reRender();
  }
  getWrapper() {
    return this.wrapper;
  }
  getScroll() {
    return this.scrollContainer.scrollLeft;
  }
  destroy() {
    var _a;
    this.container.remove();
    (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
  }
  createDelay(delayMs = 10) {
    const context = {};
    this.timeouts.push(context);
    return callback => {
      context.timeout && clearTimeout(context.timeout);
      context.timeout = setTimeout(callback, delayMs);
    };
  }
  // Convert array of color values to linear gradient
  convertColorValues(color) {
    if (!Array.isArray(color)) return color || '';
    if (color.length < 2) return color[0] || '';
    const canvasElement = document.createElement('canvas');
    const ctx = canvasElement.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasElement.height);
    const colorStopPercentage = 1 / (color.length - 1);
    color.forEach((color, index) => {
      const offset = index * colorStopPercentage;
      gradient.addColorStop(offset, color);
    });
    return gradient;
  }
  renderBarWaveform(channelData, options, ctx, vScale) {
    const topChannel = channelData[0];
    const bottomChannel = channelData[1] || channelData[0];
    const length = topChannel.length;
    const {
      width,
      height
    } = ctx.canvas;
    const halfHeight = height / 2;
    const pixelRatio = window.devicePixelRatio || 1;
    const barWidth = options.barWidth ? options.barWidth * pixelRatio : 1;
    const barGap = options.barGap ? options.barGap * pixelRatio : options.barWidth ? barWidth / 2 : 0;
    const barRadius = options.barRadius || 0;
    const barIndexScale = width / (barWidth + barGap) / length;
    const rectFn = barRadius && 'roundRect' in ctx ? 'roundRect' : 'rect';
    ctx.beginPath();
    let prevX = 0;
    let maxTop = 0;
    let maxBottom = 0;
    for (let i = 0; i <= length; i++) {
      const x = Math.round(i * barIndexScale);
      if (x > prevX) {
        const topBarHeight = Math.round(maxTop * halfHeight * vScale);
        const bottomBarHeight = Math.round(maxBottom * halfHeight * vScale);
        const barHeight = topBarHeight + bottomBarHeight || 1;
        // Vertical alignment
        let y = halfHeight - topBarHeight;
        if (options.barAlign === 'top') {
          y = 0;
        } else if (options.barAlign === 'bottom') {
          y = height - barHeight;
        }
        ctx[rectFn](prevX * (barWidth + barGap), y, barWidth, barHeight, barRadius);
        prevX = x;
        maxTop = 0;
        maxBottom = 0;
      }
      const magnitudeTop = Math.abs(topChannel[i] || 0);
      const magnitudeBottom = Math.abs(bottomChannel[i] || 0);
      if (magnitudeTop > maxTop) maxTop = magnitudeTop;
      if (magnitudeBottom > maxBottom) maxBottom = magnitudeBottom;
    }
    ctx.fill();
    ctx.closePath();
  }
  renderLineWaveform(channelData, _options, ctx, vScale) {
    const drawChannel = index => {
      const channel = channelData[index] || channelData[0];
      const length = channel.length;
      const {
        height
      } = ctx.canvas;
      const halfHeight = height / 2;
      const hScale = ctx.canvas.width / length;
      ctx.moveTo(0, halfHeight);
      let prevX = 0;
      let max = 0;
      for (let i = 0; i <= length; i++) {
        const x = Math.round(i * hScale);
        if (x > prevX) {
          const h = Math.round(max * halfHeight * vScale) || 1;
          const y = halfHeight + h * (index === 0 ? -1 : 1);
          ctx.lineTo(prevX, y);
          prevX = x;
          max = 0;
        }
        const value = Math.abs(channel[i] || 0);
        if (value > max) max = value;
      }
      ctx.lineTo(prevX, halfHeight);
    };
    ctx.beginPath();
    drawChannel(0);
    drawChannel(1);
    ctx.fill();
    ctx.closePath();
  }
  renderWaveform(channelData, options, ctx) {
    ctx.fillStyle = this.convertColorValues(options.waveColor);
    // Custom rendering function
    if (options.renderFunction) {
      options.renderFunction(channelData, ctx);
      return;
    }
    // Vertical scaling
    let vScale = options.barHeight || 1;
    if (options.normalize) {
      const max = Array.from(channelData[0]).reduce((max, value) => Math.max(max, Math.abs(value)), 0);
      vScale = max ? 1 / max : 1;
    }
    // Render waveform as bars
    if (options.barWidth || options.barGap || options.barAlign) {
      this.renderBarWaveform(channelData, options, ctx, vScale);
      return;
    }
    // Render waveform as a polyline
    this.renderLineWaveform(channelData, options, ctx, vScale);
  }
  renderSingleCanvas(channelData, options, width, height, start, end, canvasContainer, progressContainer) {
    const pixelRatio = window.devicePixelRatio || 1;
    const canvas = document.createElement('canvas');
    const length = channelData[0].length;
    canvas.width = Math.round(width * (end - start) / length);
    canvas.height = height * pixelRatio;
    canvas.style.width = `${Math.floor(canvas.width / pixelRatio)}px`;
    canvas.style.height = `${height}px`;
    canvas.style.left = `${Math.floor(start * width / pixelRatio / length)}px`;
    canvasContainer.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    this.renderWaveform(channelData.map(channel => channel.slice(start, end)), options, ctx);
    // Draw a progress canvas
    const progressCanvas = canvas.cloneNode();
    progressContainer.appendChild(progressCanvas);
    const progressCtx = progressCanvas.getContext('2d');
    if (canvas.width > 0 && canvas.height > 0) {
      progressCtx.drawImage(canvas, 0, 0);
    }
    // Set the composition method to draw only where the waveform is drawn
    progressCtx.globalCompositeOperation = 'source-in';
    progressCtx.fillStyle = this.convertColorValues(options.progressColor);
    // This rectangle acts as a mask thanks to the composition method
    progressCtx.fillRect(0, 0, canvas.width, canvas.height);
  }
  renderChannel(channelData, options, width) {
    // A container for canvases
    const canvasContainer = document.createElement('div');
    const height = this.getHeight();
    canvasContainer.style.height = `${height}px`;
    this.canvasWrapper.style.minHeight = `${height}px`;
    this.canvasWrapper.appendChild(canvasContainer);
    // A container for progress canvases
    const progressContainer = canvasContainer.cloneNode();
    this.progressWrapper.appendChild(progressContainer);
    // Determine the currently visible part of the waveform
    const {
      scrollLeft,
      scrollWidth,
      clientWidth
    } = this.scrollContainer;
    const len = channelData[0].length;
    const scale = len / scrollWidth;
    let viewportWidth = Math.min(Renderer.MAX_CANVAS_WIDTH, clientWidth);
    // Adjust width to avoid gaps between canvases when using bars
    if (options.barWidth || options.barGap) {
      const barWidth = options.barWidth || 0.5;
      const barGap = options.barGap || barWidth / 2;
      const totalBarWidth = barWidth + barGap;
      if (viewportWidth % totalBarWidth !== 0) {
        viewportWidth = Math.floor(viewportWidth / totalBarWidth) * totalBarWidth;
      }
    }
    const start = Math.floor(Math.abs(scrollLeft) * scale);
    const end = Math.floor(start + viewportWidth * scale);
    const viewportLen = end - start;
    // Draw a portion of the waveform from start peak to end peak
    const draw = (start, end) => {
      this.renderSingleCanvas(channelData, options, width, height, Math.max(0, start), Math.min(end, len), canvasContainer, progressContainer);
    };
    // Draw the waveform in viewport chunks, each with a delay
    const headDelay = this.createDelay();
    const tailDelay = this.createDelay();
    const renderHead = (fromIndex, toIndex) => {
      draw(fromIndex, toIndex);
      if (fromIndex > 0) {
        headDelay(() => {
          renderHead(fromIndex - viewportLen, toIndex - viewportLen);
        });
      }
    };
    const renderTail = (fromIndex, toIndex) => {
      draw(fromIndex, toIndex);
      if (toIndex < len) {
        tailDelay(() => {
          renderTail(fromIndex + viewportLen, toIndex + viewportLen);
        });
      }
    };
    renderHead(start, end);
    if (end < len) {
      renderTail(end, end + viewportLen);
    }
  }
  render(audioData) {
    // Clear previous timeouts
    this.timeouts.forEach(context => context.timeout && clearTimeout(context.timeout));
    this.timeouts = [];
    // Clear the canvases
    this.canvasWrapper.innerHTML = '';
    this.progressWrapper.innerHTML = '';
    this.wrapper.style.width = '';
    // Determine the width of the waveform
    const pixelRatio = window.devicePixelRatio || 1;
    const parentWidth = this.scrollContainer.clientWidth;
    const scrollWidth = Math.ceil(audioData.duration * (this.options.minPxPerSec || 0));
    // Whether the container should scroll
    this.isScrolling = scrollWidth > parentWidth;
    const useParentWidth = this.options.fillParent && !this.isScrolling;
    // Width of the waveform in pixels
    const width = (useParentWidth ? parentWidth : scrollWidth) * pixelRatio;
    // Set the width of the wrapper
    this.wrapper.style.width = useParentWidth ? '100%' : `${scrollWidth}px`;
    // Set additional styles
    this.scrollContainer.style.overflowX = this.isScrolling ? 'auto' : 'hidden';
    this.scrollContainer.classList.toggle('noScrollbar', !!this.options.hideScrollbar);
    this.cursor.style.backgroundColor = `${this.options.cursorColor || this.options.progressColor}`;
    this.cursor.style.width = `${this.options.cursorWidth}px`;
    // Render the waveform
    if (this.options.splitChannels) {
      // Render a waveform for each channel
      for (let i = 0; i < audioData.numberOfChannels; i++) {
        const options = Object.assign(Object.assign({}, this.options), this.options.splitChannels[i]);
        this.renderChannel([audioData.getChannelData(i)], options, width);
      }
    } else {
      // Render a single waveform for the first two channels (left and right)
      const channels = [audioData.getChannelData(0)];
      if (audioData.numberOfChannels > 1) channels.push(audioData.getChannelData(1));
      this.renderChannel(channels, this.options, width);
    }
    this.audioData = audioData;
    this.emit('render');
  }
  reRender() {
    // Return if the waveform has not been rendered yet
    if (!this.audioData) return;
    // Remember the current cursor position
    const oldCursorPosition = this.progressWrapper.clientWidth;
    // Set the new zoom level and re-render the waveform
    this.render(this.audioData);
    // Adjust the scroll position so that the cursor stays in the same place
    const newCursortPosition = this.progressWrapper.clientWidth;
    this.scrollContainer.scrollLeft += newCursortPosition - oldCursorPosition;
  }
  zoom(minPxPerSec) {
    this.options.minPxPerSec = minPxPerSec;
    this.reRender();
  }
  scrollIntoView(progress, isPlaying = false) {
    const {
      clientWidth,
      scrollLeft,
      scrollWidth
    } = this.scrollContainer;
    const progressWidth = scrollWidth * progress;
    const center = clientWidth / 2;
    const minScroll = isPlaying && this.options.autoCenter && !this.isDragging ? center : clientWidth;
    if (progressWidth > scrollLeft + minScroll || progressWidth < scrollLeft) {
      // Scroll to the center
      if (this.options.autoCenter && !this.isDragging) {
        // If the cursor is in viewport but not centered, scroll to the center slowly
        const minDiff = center / 20;
        if (progressWidth - (scrollLeft + center) >= minDiff && progressWidth < scrollLeft + clientWidth) {
          this.scrollContainer.scrollLeft += minDiff;
        } else {
          // Otherwise, scroll to the center immediately
          this.scrollContainer.scrollLeft = progressWidth - center;
        }
      } else if (this.isDragging) {
        // Scroll just a little bit to allow for some space between the cursor and the edge
        const gap = 10;
        this.scrollContainer.scrollLeft = progressWidth < scrollLeft ? progressWidth - gap : progressWidth - clientWidth + gap;
      } else {
        // Scroll to the beginning
        this.scrollContainer.scrollLeft = progressWidth;
      }
    }
    // Emit the scroll event
    {
      const {
        scrollLeft
      } = this.scrollContainer;
      const startX = scrollLeft / scrollWidth;
      const endX = (scrollLeft + clientWidth) / scrollWidth;
      this.emit('scroll', startX, endX);
    }
  }
  renderProgress(progress, isPlaying) {
    if (isNaN(progress)) return;
    this.progressWrapper.style.width = `${progress * 100}%`;
    this.cursor.style.left = `${progress * 100}%`;
    this.cursor.style.marginLeft = Math.round(progress * 100) === 100 ? `-${this.options.cursorWidth}px` : '';
    if (this.isScrolling && this.options.autoScroll) {
      this.scrollIntoView(progress, isPlaying);
    }
  }
}
Renderer.MAX_CANVAS_WIDTH = 4000;
var _default = exports.default = Renderer;
},{"./draggable.js":"../../node_modules/wavesurfer.js/dist/draggable.js","./event-emitter.js":"../../node_modules/wavesurfer.js/dist/event-emitter.js"}],"../../node_modules/wavesurfer.js/dist/timer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _eventEmitter = _interopRequireDefault(require("./event-emitter.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Timer extends _eventEmitter.default {
  constructor() {
    super(...arguments);
    this.unsubscribe = () => undefined;
  }
  start() {
    this.unsubscribe = this.on('tick', () => {
      requestAnimationFrame(() => {
        this.emit('tick');
      });
    });
    this.emit('tick');
  }
  stop() {
    this.unsubscribe();
  }
  destroy() {
    this.unsubscribe();
  }
}
var _default = exports.default = Timer;
},{"./event-emitter.js":"../../node_modules/wavesurfer.js/dist/event-emitter.js"}],"../../node_modules/wavesurfer.js/dist/wavesurfer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _decoder = _interopRequireDefault(require("./decoder.js"));
var _fetcher = _interopRequireDefault(require("./fetcher.js"));
var _player = _interopRequireDefault(require("./player.js"));
var _renderer = _interopRequireDefault(require("./renderer.js"));
var _timer = _interopRequireDefault(require("./timer.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const defaultOptions = {
  waveColor: '#999',
  progressColor: '#555',
  cursorWidth: 1,
  minPxPerSec: 0,
  fillParent: true,
  interact: true,
  dragToSeek: false,
  autoScroll: true,
  autoCenter: true,
  sampleRate: 8000
};
class WaveSurfer extends _player.default {
  /** Create a new WaveSurfer instance */
  static create(options) {
    return new WaveSurfer(options);
  }
  /** Create a new WaveSurfer instance */
  constructor(options) {
    var _a, _b;
    super({
      media: options.media,
      mediaControls: options.mediaControls,
      autoplay: options.autoplay,
      playbackRate: options.audioRate
    });
    this.plugins = [];
    this.decodedData = null;
    this.subscriptions = [];
    this.options = Object.assign({}, defaultOptions, options);
    this.timer = new _timer.default();
    const audioElement = !options.media ? this.getMediaElement() : undefined;
    this.renderer = new _renderer.default(this.options, audioElement);
    this.initPlayerEvents();
    this.initRendererEvents();
    this.initTimerEvents();
    this.initPlugins();
    // Load audio if URL is passed or an external media with an src
    const url = this.options.url || ((_a = this.options.media) === null || _a === void 0 ? void 0 : _a.currentSrc) || ((_b = this.options.media) === null || _b === void 0 ? void 0 : _b.src);
    if (url) {
      this.load(url, this.options.peaks, this.options.duration);
    }
  }
  initTimerEvents() {
    // The timer fires every 16ms for a smooth progress animation
    this.subscriptions.push(this.timer.on('tick', () => {
      const currentTime = this.getCurrentTime();
      this.renderer.renderProgress(currentTime / this.getDuration(), true);
      this.emit('timeupdate', currentTime);
      this.emit('audioprocess', currentTime);
    }));
  }
  initPlayerEvents() {
    this.subscriptions.push(this.onMediaEvent('timeupdate', () => {
      const currentTime = this.getCurrentTime();
      this.renderer.renderProgress(currentTime / this.getDuration(), this.isPlaying());
      this.emit('timeupdate', currentTime);
    }), this.onMediaEvent('play', () => {
      this.emit('play');
      this.timer.start();
    }), this.onMediaEvent('pause', () => {
      this.emit('pause');
      this.timer.stop();
    }), this.onMediaEvent('emptied', () => {
      this.timer.stop();
    }), this.onMediaEvent('ended', () => {
      this.emit('finish');
    }), this.onMediaEvent('seeking', () => {
      this.emit('seeking', this.getCurrentTime());
    }));
  }
  initRendererEvents() {
    this.subscriptions.push(
    // Seek on click
    this.renderer.on('click', (relativeX, relativeY) => {
      if (this.options.interact) {
        this.seekTo(relativeX);
        this.emit('interaction', relativeX * this.getDuration());
        this.emit('click', relativeX, relativeY);
      }
    }),
    // Double click
    this.renderer.on('dblclick', (relativeX, relativeY) => {
      this.emit('dblclick', relativeX, relativeY);
    }),
    // Scroll
    this.renderer.on('scroll', (startX, endX) => {
      const duration = this.getDuration();
      this.emit('scroll', startX * duration, endX * duration);
    }),
    // Redraw
    this.renderer.on('render', () => {
      this.emit('redraw');
    }));
    // Drag
    {
      let debounce;
      this.subscriptions.push(this.renderer.on('drag', relativeX => {
        if (!this.options.interact) return;
        // Update the visual position
        this.renderer.renderProgress(relativeX);
        // Set the audio position with a debounce
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          this.seekTo(relativeX);
        }, this.isPlaying() ? 0 : 200);
        this.emit('interaction', relativeX * this.getDuration());
        this.emit('drag', relativeX);
      }));
    }
  }
  initPlugins() {
    var _a;
    if (!((_a = this.options.plugins) === null || _a === void 0 ? void 0 : _a.length)) return;
    this.options.plugins.forEach(plugin => {
      this.registerPlugin(plugin);
    });
  }
  /** Set new wavesurfer options and re-render it */
  setOptions(options) {
    this.options = Object.assign({}, this.options, options);
    this.renderer.setOptions(this.options);
    if (options.audioRate) {
      this.setPlaybackRate(options.audioRate);
    }
    if (options.mediaControls != null) {
      this.getMediaElement().controls = options.mediaControls;
    }
  }
  /** Register a wavesurfer.js plugin */
  registerPlugin(plugin) {
    plugin.init(this);
    this.plugins.push(plugin);
    // Unregister plugin on destroy
    this.subscriptions.push(plugin.once('destroy', () => {
      this.plugins = this.plugins.filter(p => p !== plugin);
    }));
    return plugin;
  }
  /** For plugins only: get the waveform wrapper div */
  getWrapper() {
    return this.renderer.getWrapper();
  }
  /** Get the current scroll position in pixels */
  getScroll() {
    return this.renderer.getScroll();
  }
  /** Get all registered plugins */
  getActivePlugins() {
    return this.plugins;
  }
  loadAudio(url, blob, channelData, duration) {
    return __awaiter(this, void 0, void 0, function* () {
      this.emit('load', url);
      if (this.isPlaying()) this.pause();
      this.decodedData = null;
      // Fetch the entire audio as a blob if pre-decoded data is not provided
      if (!blob && !channelData) {
        const onProgress = percentage => this.emit('loading', percentage);
        blob = yield _fetcher.default.fetchBlob(url, onProgress, this.options.fetchParams);
      }
      // Set the mediaelement source
      this.setSrc(url, blob);
      // Decode the audio data or use user-provided peaks
      if (channelData) {
        // Wait for the audio duration
        // It should be a promise to allow event listeners to subscribe to the ready and decode events
        duration = (yield Promise.resolve(duration || this.getDuration())) || (yield new Promise(resolve => {
          this.onceMediaEvent('loadedmetadata', () => resolve(this.getDuration()));
        })) || (yield Promise.resolve(0));
        this.decodedData = _decoder.default.createBuffer(channelData, duration);
      } else if (blob) {
        const arrayBuffer = yield blob.arrayBuffer();
        this.decodedData = yield _decoder.default.decode(arrayBuffer, this.options.sampleRate);
      }
      this.emit('decode', this.getDuration());
      // Render the waveform
      if (this.decodedData) {
        this.renderer.render(this.decodedData);
      }
      this.emit('ready', this.getDuration());
    });
  }
  /** Load an audio file by URL, with optional pre-decoded audio data */
  load(url, channelData, duration) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.loadAudio(url, undefined, channelData, duration);
    });
  }
  /** Load an audio blob */
  loadBlob(blob, channelData, duration) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.loadAudio('blob', blob, channelData, duration);
    });
  }
  /** Zoom the waveform by a given pixels-per-second factor */
  zoom(minPxPerSec) {
    if (!this.decodedData) {
      throw new Error('No audio loaded');
    }
    this.renderer.zoom(minPxPerSec);
    this.emit('zoom', minPxPerSec);
  }
  /** Get the decoded audio data */
  getDecodedData() {
    return this.decodedData;
  }
  /** Get decoded peaks */
  exportPeaks({
    channels = 1,
    maxLength = 8000,
    precision = 10000
  } = {}) {
    if (!this.decodedData) {
      throw new Error('The audio has not been decoded yet');
    }
    const channelsLen = Math.min(channels, this.decodedData.numberOfChannels);
    const peaks = [];
    for (let i = 0; i < channelsLen; i++) {
      const data = this.decodedData.getChannelData(i);
      const length = Math.min(data.length, maxLength);
      const scale = data.length / length;
      const sampledData = [];
      for (let j = 0; j < length; j++) {
        const n = Math.round(j * scale);
        const val = data[n];
        sampledData.push(Math.round(val * precision) / precision);
      }
      peaks.push(sampledData);
    }
    return peaks;
  }
  /** Get the duration of the audio in seconds */
  getDuration() {
    let duration = super.getDuration() || 0;
    // Fall back to the decoded data duration if the media duration is incorrect
    if ((duration === 0 || duration === Infinity) && this.decodedData) {
      duration = this.decodedData.duration;
    }
    return duration;
  }
  /** Toggle if the waveform should react to clicks */
  toggleInteraction(isInteractive) {
    this.options.interact = isInteractive;
  }
  /** Seek to a percentage of audio as [0..1] (0 = beginning, 1 = end) */
  seekTo(progress) {
    const time = this.getDuration() * progress;
    this.setTime(time);
  }
  /** Play or pause the audio */
  playPause() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.isPlaying() ? this.pause() : this.play();
    });
  }
  /** Stop the audio and go to the beginning */
  stop() {
    this.pause();
    this.setTime(0);
  }
  /** Skip N or -N seconds from the current position */
  skip(seconds) {
    this.setTime(this.getCurrentTime() + seconds);
  }
  /** Empty the waveform by loading a tiny silent audio */
  empty() {
    this.load('', [[0]], 0.001);
  }
  /** Unmount wavesurfer */
  destroy() {
    this.emit('destroy');
    this.plugins.forEach(plugin => plugin.destroy());
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.timer.destroy();
    this.renderer.destroy();
    super.destroy();
  }
}
var _default = exports.default = WaveSurfer;
},{"./decoder.js":"../../node_modules/wavesurfer.js/dist/decoder.js","./fetcher.js":"../../node_modules/wavesurfer.js/dist/fetcher.js","./player.js":"../../node_modules/wavesurfer.js/dist/player.js","./renderer.js":"../../node_modules/wavesurfer.js/dist/renderer.js","./timer.js":"../../node_modules/wavesurfer.js/dist/timer.js"}],"main.js":[function(require,module,exports) {
'use strict';

var _wavesurfer = _interopRequireDefault(require("wavesurfer.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var waveFormContainer = document.getElementById('waveform');
var audiofileInput = document.getElementById('audio-file-input');
var playPauseButton = document.getElementById('play-pause-button');
var animatedElement = document.getElementById('animated-element');
var wavesurfer = _wavesurfer.default.create({
  container: waveFormContainer,
  progressColor: "purple",
  barGap: 2,
  barWidth: 3,
  barRadius: 3,
  cursorWidth: 3,
  cursorColor: "purple"
});
wavesurfer.once('decode', function () {
  var slider = document.querySelector('input[type="range"]');
  slider.addEventListener('input', function (e) {
    var minPxPerSec = e.target.valueAsNumber;
    wavesurfer.zoom(minPxPerSec);
  });
});
audiofileInput.addEventListener('change', function (e) {
  var files = e.target.files;
  if (!files || !files[0]) {
    return;
  }
  var fileUrl = URL.createObjectURL(files[0]);
  wavesurfer.load(fileUrl);
});
playPauseButton.addEventListener('click', function () {
  wavesurfer.playPause();
});
var formatTime = function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60);
  var secs = Math.floor(seconds % 60);
  return "".concat(minutes, ":").concat(secs < 10 ? '0' : '').concat(secs);
};
var timeEl = document.getElementById('time');
var durationEl = document.getElementById('duration');
wavesurfer.on('decode', function (duration) {
  durationEl.textContent = formatTime(duration);
});
wavesurfer.on('timeupdate', function (time) {
  timeEl.textContent = formatTime(time);
});
},{"wavesurfer.js":"../../node_modules/wavesurfer.js/dist/wavesurfer.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56787" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map