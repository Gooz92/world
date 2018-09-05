import { createTable, createElement } from '../utils/dom.utils.js';
import { noop, getObject } from '../utils/fn.utils.js';
import { generateArray } from '../utils/array.utils.js';
import Person from '../model/Person.js';

const TICK_TIME = 180;

// @ - person, O - tree

const getCellId = (x, y) => `tile-${x}-${y}`;

const classes = [ 'empty', 'obstacle', 'tree', 'person' ];

function getCell(x, y) {
  const cellId = getCellId(x, y);
  return document.getElementById(cellId);
}

let timeoutId;

const hadlers = {
  idle: noop,

  move({ data: { from, to } }) {
    const startCell = getCell(from[0], from[1]);
    const endCell = getCell(to[0], to[1]);

    startCell.className = '';
    endCell.className = 'person';
  },

  cutTree({ data: { treePosition: [ x, y ] } }) {
    getCell(x, y).className = 'empty';
  }
};

export default {
  enter: () => {

    const paths = [
      [ [ 2, 2 ], [ 40, 40 ] ],
      [ [ 2, 3 ], [ 2, 40 ] ]
    ];

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

    const table = createTable(tiles.length, tiles[0].length, (cell, y, x) => {
      const object = tiles[y][x].object;
      const objectType = object ? object.type : 0;

      cell.className = classes[objectType];

      cell.id = getCellId(x, y);
    });

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

    // const menu = createMenu();

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
