import World from '../model/World.js';
import WorldView from './WorldView';
import ObjectType from '../model/ObjectType.js';
import createControls from './create-controls.js';
import createMenu from './create-menu.js';
import getArrowKeyCode from 'utils/get-arrow-key-code.js';
import { upperFirst } from 'utils/string.utils.js';
import { generateArray } from 'utils/array.utils.js';
import { getObject, debounce } from 'utils/fn.utils.js';
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

const world = new World(
  generateArray(256, y => (
    generateArray(256, getObject)
  ))
);

world.placeTrees();

const wv = new WorldView(world, {
  getCellOptions: (x, y) => ({
    dataset: { x, y },
    onclick: () => {
      const object = wv.place(x, y, objectType);

      if (objectType === ObjectType.PERSON) {
        object.setStrategy('cutTrees');
      }
    }
  }),
  viewport: {
    position: { x: 0, y: 0 },
    size: getViewportSize()
  }
});

const info = createElement('span', {
  id: 'info'
});

window.addEventListener('resize', debounce(() => {
  const { width, height } = getViewportSize();
  wv.setViewportWidth(width);
  wv.setViewportHeight(height);
}, 200));

window.addEventListener('keydown', event => {

  /*
   * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
   * TODO move event.key to getArrowKeyCode ?
   */

  const direction = getArrowKeyCode(event.key);

  if (direction) {
    console.time('scroll');
    wv[`scroll${upperFirst(direction)}`]();
    console.timeEnd('scroll');
  }
});

const table = wv.createField();

world.actors
  .forEach(({ position: [ x, y ] }) => {
    if (wv.inViewport(x, y)) {
      wv.getCell(x, y).className = 'person';
    }
  });

controls = createControls(wv, TICK_TIME);

viewport.appendChild(table);
panel.appendChild(controls.container);

const menu = createMenu({
  onChange: newObjectType => {
    objectType = newObjectType;
  }
});

wv.field.addEventListener('mouseleave', e => {
  info.innerHTML = '-';
});

wv.field.addEventListener('mouseover', e => {
  const { x, y } = e.target.dataset;
  info.innerHTML = x + ';' + y;
});

panel.appendChild(info);

panel.appendChild(menu);
