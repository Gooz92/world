import generateWorld from '../generate-world.js';
import ObjectType from '../model/ObjectType.js';
import { createTable, createElement } from '../utils/dom.utils.js';
import { noop } from '../utils/fn.utils.js';

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
  enter: _ => {
    const world = generateWorld(64, 64, [
      [ 50, () => null ],
      [ 1, () => ({ type: ObjectType.TREE }) ],
      [ 4, () => ({ type: ObjectType.OBSTACLE }) ]
    ]);

    const table = createTable(world.tiles.length, world.tiles[0].length, (cell, y, x) => {
      const object = world.tiles[y][x].object
      const objectType = object ? object.type : 0;

      cell.className = classes[objectType];

      cell.id = getCellId(x, y);
    });

    function tick() {
      world.objects
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

    world.objects
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
