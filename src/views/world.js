import createWorld from '../model/create-world.js';
import WorldView from './WorldView';
import ObjectType from '../model/ObjectType.js';
import createControls from './create-controls.js';
import createMenu from './create-menu.js';

import getArrowKeyCode from 'utils/get-arrow-key-code.js';
import { createElement } from 'utils/dom.utils.js';
import { upperFirst } from 'utils/string.utils.js';

import { time } from 'utils/dev.utils.js';
import { debounce } from 'utils/fn.utils.js';

const TICK_TIME = 120;

let controls, objectType;

const viewport = document.getElementById('viewport');
const panel = document.getElementById('panel');

const world = createWorld();

function getViewportSize() {
  const { width, height } = viewport.getBoundingClientRect();

  return {
    width: Math.ceil(width / wv.viewport.cellSize),
    height: Math.ceil(height / wv.viewport.cellSize)
  };
}

const wv = new WorldView(world, {
  viewportSize: [ 128, 96 ],
  onTileClick: (x, y) => {
    debugger;
    const object = wv.place(x, y, objectType);

    if (objectType === ObjectType.PERSON) {
      object.setStrategy('cutTrees');
    }
  },
  onTileEnter: (x, y) => {
    const gx = world.getCycleX(wv.viewport.position[0] + x);
    const gy = world.getCycleY(wv.viewport.position[1] + y);
    info.innerHTML = gx + ';' + gy;
  }
});

const info = createElement('span', {
  id: 'info'
});

window.addEventListener('resize', debounce(event => {
  console.log(getViewportSize());
}, 150));

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

window.viewport = wv.viewport;

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
