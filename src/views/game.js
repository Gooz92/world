import WorldView from './WorldView';
import createWorld from '../model/create-world.js';
import ObjectType from '../model/ObjectType.js';

import getArrowKeyCode from 'utils/common/get-arrow-key-code.js';
import { upperFirst } from 'utils/common/string.utils.js';

import { time } from 'utils/common/dev.utils.js';
import { debounce } from 'utils/common/fn.utils.js';
import Viewport from './WorldView/Viewport';
import createButtomPanel from './create-buttom-panel';

const world = createWorld();

function getViewportSize() {
  const { width, height } = wv.viewport.container.getBoundingClientRect();

  return [
    Math.ceil(width / Viewport.DEFAULT_CELL_SIZE),
    Math.ceil(height / Viewport.DEFAULT_CELL_SIZE)
  ];
}

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

let panel;

const getTileInfo = tile => {
  if (!tile.object) {
    return 'empty';
  }

  return [ 'obstacle', 'tree', 'person' ][tile.object.type - 1];
};

const wv = new WorldView(world, {
  viewportSize: [ 40, 30 ],
  onTileClick: (x, y) => {

    if (panel.objectType === null) {
      return;
    }

    if (panel.objectType === ObjectType.EMPTY) {
      wv.clearTile(x, y);
      return;
    }

    const object = wv.place(x, y, panel.objectType);

    if (panel.objectType === ObjectType.PERSON) {
      object.setStrategy('cutTrees');
    }
  },
  onTileEnter: (x, y) => {
    const gx = world.getCycleX(wv.viewport.position[0] + x);
    const gy = world.getCycleY(wv.viewport.position[1] + y);

    const tile = world.getTile(gx, gy);
    panel.updateTileInfo(gx + ';' + gy + ' - ' + getTileInfo(tile));
  }
});

panel = createButtomPanel(() => {
  wv.tick();
});

const main = document.getElementById('main');

main.appendChild(wv.viewport.container);
main.appendChild(panel.element);

const [ w, h ] = getViewportSize();

wv.viewport.setSize(w, h);

wv.viewport.draw();
