import { createElement } from '../utils/dom.utils.js';
import { noop, getObject } from '../utils/fn.utils.js';
import { generateArray } from '../utils/array.utils.js';
import Person from '../model/Person.js';
import createField from '../create-field.js';

const TICK_TIME = 20;

// @ - person, O - tree

const getCellId = (x, y) => `tile-${x}-${y}`;

const classes = [ 'empty', 'obstacle', 'tree', 'person' ];

function getCell(x, y) {
  const cellId = getCellId(x, y);
  return document.getElementById(cellId);
}

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

    const persons = paths.map(path => {
      const person = new Person(tiles, path[0]);
      person.setStrategy('patrol', { positions: path });
      return person;
    });

    persons.forEach(person => {
      const [ x, y ] = person.position;
      tiles[y][x].object = person;
    });

    const { table, cells } = createField(tiles, tile => {
      const objectType = tile.object ? tile.object.type : 0;

      return {
        className: classes[objectType]
      };
    });

    const hadlers = {
      idle: noop,

      move({ data: { from, to } }) {
        const [ fromX, fromY ] = from;
        const [ toX, toY ] = to;

        const startCell = cells[fromY][fromX];
        const endCell = cells[toY][toX];

        startCell.className = '';
        endCell.className = 'person';
      }
    };

    function tick() {
      persons
        .forEach(object => {
          const event = object.act();
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

    persons
      .forEach(({ position: [ x, y ] }) => {
        getCell(x, y).className = 'person';
      });

    document.body.appendChild(playButton);
    document.body.appendChild(stopButton);
    document.body.appendChild(stepButton);

    // gameLoop();
  },

  leave: _ => {
    document.body.innerHTML = '';
    clearTimeout(timeoutId);
  }
};
