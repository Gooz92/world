import createWorld from '../model/create-world.js';
import WorldView from './WorldView';
import ObjectType from '../model/ObjectType.js';
import createControls from './create-controls.js';
import createMenu from './create-menu.js';
import getArrowKeyCode from 'utils/get-arrow-key-code.js';
import { getSize } from 'utils/geometry.utils.js';
import { createElement } from 'utils/dom.utils.js';

const TICK_TIME = 120;

let controls, objectType;

const viewport = document.getElementById('viewport');
const panel = document.getElementById('panel');

function getViewportSize() {
  const { width, height } = viewport.getBoundingClientRect();

  return getSize(
    Math.ceil(width / WorldView.CELL_SIZE),
    Math.ceil(height / WorldView.CELL_SIZE)
  );
}

const world = createWorld();

const wv = new WorldView(world, {
  onclick: (x, y) => {
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
    console.log(direction);
  }
});

const canvas = wv.createCanvas();

world.actors
  .forEach(({ position: [ x, y ] }) => {
    if (wv.inViewport(x, y)) {
      wv.getCell(x, y).className = 'person';
    }
  });

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
