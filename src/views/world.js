import World from '../model/World.js';
import WorldView from './WorldView.js';
import ObjectType from '../model/ObjectType.js';
import Person from '../model/Person.js';
import createControls from './create-controls.js';

const TICK_TIME = 120;

let timeoutId;

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

    const { table, cells } = wv.createField();

    wv.world.actors
      .forEach(({ position: [ x, y ] }) => {
        cells[y][x].className = 'person';
      });

    const controls = createControls(wv, TICK_TIME);

    document.body.appendChild(table);
    document.body.appendChild(controls);
  },

  leave: () => {
    document.body.innerHTML = '';
    clearTimeout(timeoutId);
  }
};
