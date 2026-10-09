import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const code = ts.transpileModule(fs.readFileSync('src/components/club-site-tour.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function fixture(reduced = false, rejectVideo = false) {
  const frames = new Map(), listeners = new Map();
  let frameId = 0, now = 0, intersection, resize;
  const stage = { dataset: {} }, progress = { style: {} };
  const media = { matches: reduced, addEventListener: (_, fn) => listeners.set('motion', fn), removeEventListener: () => listeners.delete('motion') };
  const document = { hidden: false, addEventListener: (_, fn) => listeners.set('visibility', fn), removeEventListener: () => listeners.delete('visibility') };
  const devices = ['mac', 'phone'].map(name => {
    const viewport = { clientWidth: name === 'mac' ? 1395 : 375, clientHeight: name === 'mac' ? 912 : 600 };
    const videos = [];
    const layers = [0, 1].map(index => {
      const layerVideos = (index === 0 ? ['hero', 'reel'] : ['hero']).map(kind => {
        const events = new Map(), surface = { dataset: {} };
        const element = {
          dataset: { tourVideo: kind, videoTop: kind === 'hero' ? '0' : name === 'mac' ? '2144.6875' : '2717', videoHeight: kind === 'hero' ? '720' : name === 'mac' ? '740.078125' : '420' },
          parentElement: surface, paused: true, playCalls: 0,
          addEventListener: (event, fn) => events.set(event, fn), removeEventListener: event => events.delete(event),
          play() { this.playCalls++; if (rejectVideo) return Promise.reject(new Error('Playback blocked')); this.paused = false; events.get('playing')?.(); return Promise.resolve(); },
          pause() { this.paused = true; },
        };
        videos.push(element); return element;
      });
      return { parentElement: viewport, style: {}, querySelectorAll: () => layerVideos };
    });
    const images = [0, 1].map(() => ({ complete: true, naturalWidth: name === 'mac' ? 1395 : 375, naturalHeight: name === 'mac' ? 4944 : 6914, decode: () => Promise.resolve() }));
    return { dataset: { tourDevice: name }, hidden: false, getAttribute() { return String(this.hidden); }, querySelectorAll: selector => selector.includes('capture') ? images : layers, images, layers, videos };
  });
  const root = { querySelector: selector => selector.includes('stage') ? stage : progress, querySelectorAll: () => devices };
  const exports = {};
  vm.runInNewContext(code, {
    exports, document, matchMedia: () => media,
    requestAnimationFrame: fn => { const id = ++frameId; frames.set(id, fn); return id; },
    cancelAnimationFrame: id => frames.delete(id),
    IntersectionObserver: class { constructor(fn) { intersection = fn; } observe() {} disconnect() { intersection = null; } },
    ResizeObserver: class { constructor(fn) { resize = fn; } observe() {} disconnect() { resize = null; } },
  });
  let state;
  const controller = exports.createClubTour(root, next => { state = next; });
  return {
    controller, exports, devices, stage, progress, frames, listeners,
    state: () => state,
    visible(value) { intersection([{ isIntersecting: value, intersectionRatio: value ? 1 : 0 }]); },
    hidden(value) { document.hidden = value; listeners.get('visibility')(); },
    reduce(value) { media.matches = value; listeners.get('motion')(); },
    resize() { resize(); },
    step(count = 1) { for (let i = 0; i < count; i++) { now += 100; const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn(now)); } },
    transforms: () => devices.flatMap(d => d.layers.map(layer => `${layer.style.transform}|${layer.style.opacity}`)),
  };
}
const loaded = async () => { await new Promise(resolve => setImmediate(resolve)); };

test('autoplay loops into the opening and keeps the return transition continuous', async () => {
  const f = fixture(); await loaded(); f.visible(true); f.step(318);
  assert.equal(f.state().playing, true);
  assert.ok(Number(f.devices[0].layers[1].style.opacity) > .5);
  f.step(5);
  assert.equal(f.state().chapter, 0);
  assert.equal(f.devices[0].layers[0].style.transform, 'translate3d(0,0px,0)');
  assert.equal(f.devices[0].layers[0].style.opacity, '1');
  assert.equal(f.stage.dataset.playback, 'playing');
  f.controller.destroy();
});

test('pause freezes both screens and survives visibility changes; play resumes that position', async () => {
  const f = fixture(); await loaded(); f.visible(true); f.step(70);
  f.controller.toggle(); const paused = f.transforms(); f.step(20);
  assert.deepEqual(f.transforms(), paused);
  f.visible(false); f.visible(true); f.hidden(true); f.hidden(false); f.step(20);
  assert.deepEqual(f.transforms(), paused);
  assert.equal(f.state().playing, false);
  f.controller.toggle(); f.step(3);
  assert.notDeepEqual(f.transforms(), paused);
  f.controller.destroy();
});

test('offscreen and hidden tours suspend without advancing their clock', async () => {
  const f = fixture(); await loaded(); f.visible(true); f.step(70);
  f.visible(false); const position = f.transforms(); f.step(30);
  assert.deepEqual(f.transforms(), position);
  f.visible(true); f.step(); assert.deepEqual(f.transforms(), position);
  f.hidden(true); f.step(30); assert.deepEqual(f.transforms(), position);
  f.hidden(false); f.step(); assert.deepEqual(f.transforms(), position);
  f.step(2); assert.notDeepEqual(f.transforms(), position);
  f.controller.destroy();
});

test('reduced motion stays static while still allowing manual highlights', async () => {
  const f = fixture(true); await loaded(); f.visible(true); f.step(100);
  assert.equal(f.state().playing, false);
  assert.equal(f.frames.size, 0);
  f.controller.select(2);
  assert.equal(f.state().chapter, 2);
  const selected = f.transforms(); f.controller.toggle(); f.step(100);
  assert.deepEqual(f.transforms(), selected);
  assert.equal(f.state().playing, false);
  f.controller.destroy();
});

test('changing reduced motion stops playback, and unmount cleans up observers and frames', async () => {
  const f = fixture(); await loaded(); f.visible(true); f.step(100);
  f.reduce(true); assert.equal(f.state().playing, false); assert.equal(f.frames.size, 0);
  f.reduce(false); assert.equal(f.state().playing, false);
  f.controller.toggle(); f.step(3); assert.equal(f.frames.size, 1);
  f.controller.destroy(); assert.equal(f.frames.size, 0); assert.equal(f.listeners.size, 0);
});


test('footage plays during scrolling and pause stops both visible devices', async () => {
  const f = fixture(); await loaded(); f.visible(true); f.step(55);
  assert.ok(f.devices.every(d => !d.videos[0].paused));
  assert.notEqual(f.devices[1].layers[0].style.transform, 'translate3d(0,0px,0)');
  f.controller.toggle();
  assert.ok(f.devices.every(d => d.videos.every(video => video.paused)));
  f.controller.toggle(); f.step();
  assert.ok(f.devices.every(d => !d.videos[0].paused));
  f.visible(false);
  assert.ok(f.devices.every(d => d.videos.every(video => video.paused)));
  f.visible(true); f.hidden(true);
  assert.ok(f.devices.every(d => d.videos.every(video => video.paused)));
  f.controller.destroy();
});

test('only footage visible within an active device screen plays', async () => {
  const f = fixture(); await loaded(); f.visible(true); f.step(100);
  assert.ok(f.devices.every(d => d.videos[0].paused && !d.videos[1].paused && d.videos[2].paused));
  f.devices[1].hidden = true; f.step();
  assert.ok(f.devices[1].videos.every(video => video.paused));
  assert.equal(f.devices[0].videos[1].paused, false);
  f.controller.destroy();
  assert.ok(f.devices.every(d => d.videos.every(video => video.paused)));
});

test('blocked video preserves the still capture and tour; reduced motion never starts video', async () => {
  const f = fixture(false, true); await loaded(); f.visible(true); f.step(100); await loaded();
  assert.equal(f.state().failed, false);
  assert.equal(f.stage.dataset.playback, 'playing');
  assert.ok(f.devices.every(d => d.videos.every(video => !video.parentElement.dataset.videoReady)));
  f.controller.destroy();
  const reduced = fixture(true); await loaded(); reduced.visible(true); reduced.step(100);
  assert.ok(reduced.devices.every(d => d.videos.every(video => video.playCalls === 0)));
  reduced.controller.destroy();
});
