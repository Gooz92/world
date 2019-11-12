import ObjectType from 'model/ObjectType.enum.js';
import createWorld from 'model/create-world.js';

import WorldView from './WorldView';
import Viewport from './WorldView/Viewport.js';
import createButtomPanel from './create-buttom-panel';

import { paramsHandler } from '../app.utils.js';
import getArrowKeyCode from 'utils/common/get-arrow-key-code.js';
import { upperFirst } from 'utils/common/string.utils.js';
import { time } from 'utils/common/dev.utils.js';
import { debounce } from 'utils/common/fn.utils.js';
import WalkStrategy from 'model/strategies/WalkStrategy';
import PathFinder from 'utils/path-finding/PathFinder.js';
import { get } from 'utils/common/object.utils.js';

let wv;

const viewportBuilder = Viewport
  .createBuilder()
  .setOptions({
    tilesSprite: document.getElementById('tiles-sprite')
  });

const getTileInfo = tile => {
  if (!tile.object) {
    return 'empty';
  }

  return tile.object.type.name;
};

paramsHandler(({ seed, empty }) => {

  const panel = createButtomPanel(() => {
    wv.tick();
    panel.updateSelectionInfo(wv.selection);
  });

  const main = document.getElementById('main');
  main.innerHTML = '';

  const world = createWorld({ seed, empty });

  const viewport = viewportBuilder
    .setWorld(world)
    .setOptions({
      onRightClick: (vx, vy) => {

        if (get(wv, 'selection.object.type') === ObjectType.PERSON) {

          const gx = world.getCycleX(wv.viewport.position[0] + vx);
          const gy = world.getCycleY(wv.viewport.position[1] + vy);

          const [ x0, y0 ] = wv.selection.object.position;

          const pathFinder = new PathFinder({
            isTileFound: (tile, x, y) => (
              x === gx && y === gy
            ),
            isTilePassable: tile => (
              !tile.object || tile.object.type === ObjectType.PERSON
            )
          });

          const path = pathFinder.find(world.tiles, x0, y0);

          wv.selection.object.setStrategy(WalkStrategy, { path });
        }
      },

      onTileClick: (x, y) => {

        if (panel.selectedItem === null) {
          const selection = wv.select(x, y);
          panel.updateSelectionInfo(selection);
          return;
        }

        panel.selectedItem.action(wv, x, y);

        if (panel.selectedItem.id === 0) {
          panel.updateSelectionInfo(wv.selection);
          return;
        }
      },

      onTileEnter: (x, y) => {
        const gx = world.getCycleX(wv.viewport.position[0] + x);
        const gy = world.getCycleY(wv.viewport.position[1] + y);

        const tile = world.getTile(gx, gy);
        panel.updateTileInfo(gx + ';' + gy + ' - ' + getTileInfo(tile));
      }
    })
    .build();

  wv = WorldView.getInstance(world, viewport);

  if (viewport.layers.length === 0) {
    wv.initLayers();
  }

  main.appendChild(viewport.container);
  main.appendChild(panel.element);

  wv.viewport.adjustViewportSize();

  wv.viewport.draw();
});

window.addEventListener('resize', debounce(event => {
  wv.viewport.adjustViewportSize();
}, 150));

window.addEventListener('keydown', event => {

  /*
   * https://developer.zilla.org/en-US/docs/Web/API/KeyboardEvent/key
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
