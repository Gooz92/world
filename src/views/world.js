import World from '../model/World.js';
import WorldView from './WorldView.js';
import ObjectType from '../model/ObjectType.js';
import { createElement } from '../utils/dom.utils.js';
import { noop } from '../utils/fn.utils.js';
import createField from '../create-field.js';
import Person from '../model/Person.js';

const TICK_TIME = 120;

let timeoutId;

const classes = [ 'empty', 'obstacle', 'tree', 'person' ];

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

    const { table, cells } = createField(world.tiles, tile => {
      const objectType = tile.object ? tile.object.type : 0;

      return {
        className: classes[objectType]
      };
    });

    function tick() {
      world.tick()
        .forEach(event => {
          hadlers[event.type](event);
        });
    }

    function gameLoop() {
      tick();
      timeoutId = setTimeout(gameLoop, TICK_TIME);
    }

    const stepButton = createElement('button', {
      innerHTML: 'Step',
      onclick: () => {
        tick();
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
