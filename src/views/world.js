import World from '../model/World.js';
import WorldView from './WorldView';
import ObjectType from '../model/ObjectType.js';
import Person from '../model/Person.js';
import createControls from './create-controls.js';
import createMenu from './create-menu.js';
import getArrowKeyCode from 'utils/get-arrow-key-code.js';
import { upperFirst } from 'utils/string.utils.js';

const TICK_TIME = 120;

let controls, objectType;

const viewport = document.getElementById('viewport');
const panel = document.getElementById('panel');

const world = World.createRandomWorld(48, 64, [
  [ 200, () => null ],
  [ 4, () => ({ type: ObjectType.TREE }) ],
  [ 16, () => ({ type: ObjectType.OBSTACLE }) ],
  [ 1, (x, y, tiles) => {
    const person = new Person(tiles, [ x, y ]);
    person.setStrategy('cutTrees');
    return person;
  }]
]);

const wv = new WorldView(world);

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

const table = wv.createField((tile, x, y) => ({
  onclick: () => {
    wv.place(x, y, objectType);
  }
}));

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
