import WorldView from './WorldView';
import createWorld from '../model/create-world.js';
import ObjectType from 'model/ObjectType.enum.js';

import getArrowKeyCode from 'utils/common/get-arrow-key-code.js';
import { upperFirst } from 'utils/common/string.utils.js';

import { time } from 'utils/common/dev.utils.js';
import { debounce } from 'utils/common/fn.utils.js';
import Viewport from './WorldView/Viewport';
import createButtomPanel from './create-buttom-panel';
import { paramsHandler } from '../app.utils.js';

paramsHandler(({ seed, empty }) => {
  console.log(seed, empty);
});

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

  // TODO
  return [ 'obstacle', 'tree', 'person' ][tile.object.type.id - 1];
};

const wv = new WorldView(world, new Viewport(world, {
  size: [ 40, 30 ],
  tilesSprite: document.getElementById('tiles-sprite'),
  onTileClick: (x, y) => {

    if (panel.objectType === null) {
      const selection = wv.select(x, y);
      panel.updateSelectionInfo(selection);
      return;
    }

    if (panel.objectType === 0) {
      wv.clearTile(x, y);
      panel.updateSelectionInfo(wv.selection);
      return;
    }

    const type = ObjectType.fromId(panel.objectType);

    const object = wv.place(x, y, type);

    if (type === ObjectType.PERSON) {
      object.setStrategy('cutTrees');
    }
  },
  onTileEnter: (x, y) => {
    const gx = world.getCycleX(wv.viewport.position[0] + x);
    const gy = world.getCycleY(wv.viewport.position[1] + y);

    const tile = world.getTile(gx, gy);
    panel.updateTileInfo(gx + ';' + gy + ' - ' + getTileInfo(tile));
  }
}));

wv.initLayers();

panel = createButtomPanel(() => {
  wv.tick();
  panel.updateSelectionInfo(wv.selection);
});

const main = document.getElementById('main');

main.appendChild(wv.viewport.container);
main.appendChild(panel.element);

const [ w, h ] = getViewportSize();

wv.viewport.setSize(w, h);

wv.viewport.draw();
