import BottomPanel from './BottomPanel.js';
import Tools from './Tools.js';
import PlayControls from './PlayControls.js';

import WorldView from './WorldView';
import Viewport from './WorldView/Viewport.js';
import ObjectType from 'model/ObjectType.enum.js';

import createWorld from 'model/create-world.js';

import { debounce } from 'utils/common/fn.utils.js';
import { upperFirst } from 'utils/common/string.utils.js';
import getArrowKeyCode from 'utils/common/get-arrow-key-code.js';

const place = type => (
  (worldView, x, y) => {
    worldView.place(x, y, type);
  }
);

const panel = new BottomPanel({}, {
  controls: [ Tools, PlayControls ],
  tools: [
    { id: 'person', apply: place(ObjectType.PERSON) },
    { id: 'tree', apply: place(ObjectType.TREE) }
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
      panel.tool.apply(worldView, x, y);
    },

    onTileEnter(x, y) {
      // const gx = world.getCycleX(viewport.position[0] + x);
      // const gy = world.getCycleY(viewport.position[1] + y);

      // const tile = world.getTile(gx, gy);
    }
  })
  .build();

const worldView = WorldView.getInstance(world, viewport);
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

