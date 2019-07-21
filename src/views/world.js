import WorldView from './WorldView';
import createWorld from '../model/create-world.js';
import ObjectType from '../model/ObjectType.js';
import createControls from './create-controls.js';
import createMenu from './create-menu.js';

import getArrowKeyCode from 'utils/common/get-arrow-key-code.js';
import { createElement } from 'utils/common/dom.utils.js';
import { upperFirst } from 'utils/common/string.utils.js';

import { time } from 'utils/common/dev.utils.js';
import { debounce } from 'utils/common/fn.utils.js';
import Viewport from './WorldView/Viewport';

const TICK_TIME = 80;

let controls, objectType;

const viewport = document.getElementById('viewport');
const panel = document.getElementById('panel');

const world = createWorld();

function getViewportSize() {
  const { width, height } = viewport.getBoundingClientRect();

  return [
    Math.ceil(width / Viewport.DEFAULT_CELL_SIZE),
    Math.ceil(height / Viewport.DEFAULT_CELL_SIZE)
  ];
}

const vs = getViewportSize();

const getTileInfo = tile => {
  if (!tile.object) {
    return 'empty';
  }

  return [ 'obstacle', 'tree', 'person' ][tile.object.type - 1];
};

const wv = new WorldView(world, {
  viewportSize: vs,
  onTileClick: (x, y) => {

    if (objectType === ObjectType.EMPTY) {
      wv.clearTile(x, y);
      return;
    }

    const object = wv.place(x, y, objectType);

    if (objectType === ObjectType.PERSON) {
      object.setStrategy('cutTrees');
    }
  },
  onTileEnter: (x, y) => {
    const gx = world.getCycleX(wv.viewport.position[0] + x);
    const gy = world.getCycleY(wv.viewport.position[1] + y);

    const tile = world.getTile(gx, gy);
    info.innerHTML = gx + ';' + gy + ' ' + getTileInfo(tile);
  }
});

const info = createElement('span#info');

window.addEventListener('resize', debounce(event => {
  const [ w, h ] = getViewportSize();

  wv.viewport.setWidth(w);
  wv.viewport.setHeight(h);
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

const canvas = wv.viewport.createCanvas();

wv.viewport.draw();

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
