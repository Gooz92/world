import BottomPanel from './BottomPanel.js';
import ToolsSelector from './ToolsSelector.js';
import PlayControls from './PlayControls.js';

import WorldView from '../WorldView';
import Viewport from '../WorldView/Viewport.js';

import createWorld from 'model/create-world.js';

import tools from './tools.js';

import { debounce, noop } from 'utils/common/fn.utils.js';
import { upperFirst } from 'utils/common/string.utils.js';
import getArrowKeyCode from 'utils/common/get-arrow-key-code.js';

const panel = new BottomPanel({}, {
  controls: [
    ToolsSelector,
    PlayControls,
    BottomPanel.SelectionInfo,
    BottomPanel.TilePosition
  ],
  tools,
  dispatch: state => {
    panel.update(state);
  }
});

const dispatch = state => {
  panel.update(state);
};

const world = createWorld({ seed: 42, empty: false });

const viewportBuilder = Viewport.createBuilder();

const viewport = viewportBuilder
  .setWorld(world)
  .setOptions({
    tilesSprite: document.getElementById('tiles-sprite'),

    click: (x, y) => {
      (panel.tool.click || noop)(worldView, x, y, dispatch);
    },

    mouseMove(x, y) {
      (panel.tool.mouseMove || noop)(worldView, x, y, dispatch);

      const gx = world.getCycleX(viewport.position[0] + x);
      const gy = world.getCycleY(viewport.position[1] + y);

      panel.update({ tilePosition: [ gx, gy ] });
    },

    mouseDown(x, y) {
      (panel.tool.mouseDown || noop)(worldView, x, y, dispatch);
    },

    mouseUp(x, y) {
      (panel.tool.mouseUp || noop)(worldView, x, y, dispatch);
    },

    rightClick(x, y) {
      worldView.resetSelection();
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

