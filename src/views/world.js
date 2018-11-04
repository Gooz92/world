import World from '../model/World.js';
import WorldView from './WorldView';
import ObjectType from '../model/ObjectType.js';
import Person from '../model/Person.js';
import createControls from './create-controls.js';
import createMenu from './create-menu.js';
import getArrowKeyCode from 'utils/get-arrow-key-code.js';
import { upperFirst } from 'utils/string.utils.js';
import { generateArray } from 'utils/array.utils.js';
import { getObject } from 'utils/fn.utils.js';

const TICK_TIME = 120;

let controls, objectType;

const viewport = document.getElementById('viewport');
const panel = document.getElementById('panel');

const world = new World(
  generateArray(128, y => (
    generateArray(128, getObject)
  ))
);

const wv = new WorldView(world, {
  getCellOptions: (x, y) => ({
    id: `tile-${x}-${y}`,
    onclick: () => {
      const object = wv.place(x, y, objectType);

      if (objectType === ObjectType.PERSON) {
        object.setStrategy('cutTrees');
      }
    }
  })
});

window.addEventListener('keydown', event => {

  /*
   * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
   * TODO move event.key to getArrowKeyCode ?
   */

  const direction = getArrowKeyCode(event.key);

  if (direction) {
    wv[`scroll${upperFirst(direction)}`]();
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

panel.appendChild(menu);
