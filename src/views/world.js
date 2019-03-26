import createWorld from '../model/create-world.js';
import WorldView from './WorldView';
import ObjectType from '../model/ObjectType.js';
import createControls from './create-controls.js';
import createMenu from './create-menu.js';

import getArrowKeyCode from 'utils/get-arrow-key-code.js';
import { createElement } from 'utils/dom.utils.js';
import { upperFirst } from 'utils/string.utils.js';

import { time } from 'utils/dev.utils.js';

const TICK_TIME = 120;

let controls, objectType;

const viewport = document.getElementById('viewport');
const panel = document.getElementById('panel');

const world = createWorld();

const wv = new WorldView(world, {
  onTileClick: (x, y) => {
    const object = wv.place(x, y, objectType);

    if (objectType === ObjectType.PERSON) {
      object.setStrategy('cutTrees');
    }
  }
});

const info = createElement('span', {
  id: 'info'
});

window.addEventListener('keydown', event => {

  /*
   * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
   * TODO move event.key to getArrowKeyCode ?
   */

  const direction = getArrowKeyCode(event.key);

  if (direction) {
    const m = wv[`scroll${upperFirst(direction)}`];

    if (m) {
      time(direction, () => m.call(wv));
    }
  }
});

const canvas = wv.viewport.createCanvas();

controls = createControls(wv, TICK_TIME);

viewport.appendChild(canvas);
panel.appendChild(controls.container);

const menu = createMenu({
  onChange: newObjectType => {
    objectType = newObjectType;
  }
});

panel.appendChild(info);

panel.appendChild(menu);
