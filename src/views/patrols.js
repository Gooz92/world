import World from '../model/World';
import WorldView from './WorldView';
import { generateArray } from '../utils/array.utils.js';
import { getObject } from '../utils/fn.utils.js';
import Person from '../model/Person.js';
import createControls from './create-controls.js';

const TICK_TIME = 500;

let controls;

const paths = [
  [ [ 2, 2 ], [ 40, 40 ] ],
  [ [ 2, 3 ], [ 2, 40 ] ]
];

export default {
  enter: () => {

    const tiles = generateArray(48, y => (
      generateArray(48, getObject)
    ));

    const people = paths.map(path => {
      const person = new Person(tiles, path[0]);
      person.setStrategy('patrol', { positions: path });
      return person;
    });

    people.forEach(person => {
      const [ x, y ] = person.position;
      tiles[y][x].object = person;
    });

    const world = new World(tiles, people);
    const worldView = new WorldView(world);

    const { table, cells } = worldView.createField();

    world.actors
      .forEach(({ position: [ x, y ] }) => {
        cells[y][x].className = 'person';
      });

    document.body.appendChild(table);

    controls = createControls(worldView, TICK_TIME);

    document.body.appendChild(controls.container);
  },

  leave: () => {
    document.body.innerHTML = '';
    clearTimeout(controls.timeoutId);
  }
};
