import createWorld from '../model/create-world.js';
import ObjectType from 'model/ObjectType.enum.js';

import WorldView from './WorldView';
import Viewport from './WorldView/Viewport.js';
import createButtomPanel from './create-buttom-panel';

import getArrowKeyCode from 'utils/common/get-arrow-key-code.js';
import { upperFirst } from 'utils/common/string.utils.js';
import { paramsHandler, getViewportSize } from '../app.utils.js';
import { time } from 'utils/common/dev.utils.js';
import { debounce } from 'utils/common/fn.utils.js';

const wv = new WorldView(null, null);

const viewport = new Viewport(null, {
  tilesSprite: document.getElementById('tiles-sprite')
});

let panel;

const getTileInfo = tile => {
  if (!tile.object) {
    return 'empty';
  }

  return tile.object.type.name;
};

panel = createButtomPanel(() => {
  wv.tick();
  panel.updateSelectionInfo(wv.selection);
});

const main = document.getElementById('main');

main.appendChild(viewport.container);

main.appendChild(panel.element);

paramsHandler(({ seed, empty }) => {
  const world = createWorld({ seed, empty });

  viewport.world = world;
  viewport.setOptions({
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
  });

  wv.world = world;
  wv.viewport = viewport;

  if (viewport.layers.length === 0) {
    wv.initLayers();
  }

  const [ w, h ] = getViewportSize(wv.viewport.container, wv.viewport.cellSize);

  wv.viewport.setSize(w, h);

  wv.viewport.draw();
});

window.addEventListener('resize', debounce(event => {
  const [ w, h ] = getViewportSize(wv.viewport.container, wv.viewport.cellSize);

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

