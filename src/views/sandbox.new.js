import BottomPanel from './BottomPanel.js';
import Tools from './Tools.js';
import PlayControls from './PlayControls.js';

import WorldView from './WorldView';
import Viewport from './WorldView/Viewport.js';
import ObjectType from 'model/ObjectType.enum.js';

import createWorld from 'model/create-world.js';

import { debounce, noop } from 'utils/common/fn.utils.js';
import { upperFirst } from 'utils/common/string.utils.js';
import getArrowKeyCode from 'utils/common/get-arrow-key-code.js';

const place = type => (
  (worldView, x, y) => {
    worldView.place(x, y, type);
  }
);

function placeOnArea(type) {
  let startX, startY;

  let endX, endY;

  return {
    ondown: (worldView, x, y) => {
      startX = x;
      startY = y;
    },

    onmove: (worldView, x, y) => {
      if (endX) {
        worldView.viewport.clearArea(startX, startY, endX, endY);
      }

      endX = x;
      endY = y;

      worldView.viewport.drawArea(startX, startY, endX, endY);
    }
  };
}

const panel = new BottomPanel({}, {
  controls: [ Tools, PlayControls ],
  tools: [
    { id: 'person', click: place(ObjectType.PERSON) },
    { id: 'tree', click: place(ObjectType.TREE) },

    {
      id: 'stock',
      ...placeOnArea(ObjectType.STOCK)
    }
  ],
  dispatch: state => {
    panel.update(state);
  }
});

const world = createWorld({ seed: 42, empty: false });

const viewportBuilder = Viewport.createBuilder();

const viewport = viewportBuilder
  .setWorld(world)
  .setOptions({
    tilesSprite: document.getElementById('tiles-sprite'),

    onTileClick: (x, y) => {
      (panel.tool.click || noop)(worldView, x, y);
    },

    onTileEnter(x, y) {
      (panel.tool.onmove || noop)(worldView, x, y);
    },

    onMouseDown(x, y) {
      (panel.tool.ondown || noop)(worldView, x, y);
    }
  })
  .build();

const worldView = WorldView.getInstance(world, viewport);

window.wv = worldView; // TODO

worldView.initLayers();

const main = document.getElementById('main');

main.appendChild(viewport.container);
main.appendChild(panel.element);

viewport.adjustViewportSize();

viewport.draw();

window.addEventListener('resize', debounce(event => {
  viewport.adjustViewportSize();
}, 150));

window.addEventListener('keydown', event => {

  /*
   * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
   * TODO move event.key to getArrowKeyCode ?
   */

  const direction = getArrowKeyCode(event.key);

  if (direction) {
    worldView[`scroll${upperFirst(direction)}`].call(worldView);
  }
});

