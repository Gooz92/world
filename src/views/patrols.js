import World from '../model/World.js';
import WorldView from './WorldView.js';
import { createElement } from '../utils/dom.utils.js';
import { generateArray } from '../utils/array.utils.js';
import { getObject } from '../utils/fn.utils.js';
import Person from '../model/Person.js';

const TICK_TIME = 20;

let timeoutId;

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
    worldView.init();

    const { table, cells } = worldView.createField();

    function gameLoop() {
      worldView.tick();
      timeoutId = setTimeout(gameLoop, TICK_TIME);
    }

    const stepButton = createElement('button', {
      innerHTML: 'Step',
      onclick: () => {
        worldView.tick();
      }
    });

    const playButton = createElement('button', {
      innerHTML: 'Play',
      onclick: () => {
        playButton.disabled = true;
        stopButton.disabled = false;
        gameLoop();
      }
    });

    const stopButton = createElement('button', {
      innerHTML: 'Stop',
      disabled: true,
      onclick: () => {
        clearTimeout(timeoutId);
        stopButton.disabled = true;
        playButton.disabled = false;
      }
    });

    document.body.appendChild(table);

    world.actors
      .forEach(({ position: [ x, y ] }) => {
        cells[y][x].className = 'person';
      });

    document.body.appendChild(playButton);
    document.body.appendChild(stopButton);
    document.body.appendChild(stepButton);
  },

  leave: () => {
    document.body.innerHTML = '';
    clearTimeout(timeoutId);
  }
};
