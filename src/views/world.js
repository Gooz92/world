import World from '../model/World.js';
import WorldView from './WorldView.js';
import ObjectType from '../model/ObjectType.js';
import Person from '../model/Person.js';
import createControls from './create-controls.js';
import createMenu from './create-menu.js';

const TICK_TIME = 120;

let controls, objectType;

export default {
  enter: () => {
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
    wv.init();

    const { table, cells } = wv.createField((tile, x, y) => ({
      onclick: () => {
        wv.place(x, y, objectType);
      }
    }));

    world.actors
      .forEach(({ position: [ x, y ] }) => {
        cells[y][x].className = 'person';
      });

    controls = createControls(wv, TICK_TIME);

    document.body.appendChild(table);
    document.body.appendChild(controls.container);

    const menu = createMenu({
      onChange: newObjectType => {
        objectType = newObjectType;
      }
    });

    document.body.appendChild(menu);
  },

  leave: () => {
    document.body.innerHTML = '';
    clearTimeout(controls.timeoutId);
  }
};
