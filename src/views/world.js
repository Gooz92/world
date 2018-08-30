import generateWorld from '../generate-world.js';
import step from '../step.js';
import TILE_TYPES from '../tile-types.js';
import { createTable, createElement } from '../utils/dom.utils.js';

const brushes = [
  'erase',
  'obstacle',
  'tree',
  'person'
];
function createMenu() {
  const menu = createElement('ul', { className: 'menu' });

  brushes.forEach(brush => {
    const item = createElement('li');

    const label = createElement('label', {
      htmlFor: brush, // reflects 'for' attribute
      innerHTML: brush
    });

    const radioButton = createElement('input', {
      id: brush,
      type: 'radio',
      name: 'brush',
      value: brush
    });

    item.appendChild(label);
    item.appendChild(radioButton);

    menu.appendChild(item);
  });

  return menu;
}

const TICK_TIME = 180;

// @ - person, O - tree

const getCellId = (x, y) => `tile-${x}-${y}`;

const classes = [ 'empty', 'obstacle', 'tree', 'person' ];

function getCell(x, y) {
  const cellId = getCellId(x, y);
  return document.getElementById(cellId);
}

let timeoutId;

function viewMove(from, to, objectType) {
  const startCell = getCell(from[0], from[1]);
  const endCell = getCell(to[0], to[1]);

  startCell.className = '';
  endCell.className = objectType;

  return to;
}

export default {
  enter: _ => {
    const world = generateWorld(64, 64, [
      [ 50, TILE_TYPES.EMPTY ],
      [ 1, TILE_TYPES.TREE ],
      [ 4, TILE_TYPES.OBSTACLE ]
    ]);

    function gameLoop() {

      const moves = step(world);

      moves.forEach(({ data: { from, to } }) => {
        viewMove(from, to, 'person');
      });

      timeoutId = setTimeout(gameLoop, TICK_TIME);
    }

    const table = createTable(world.tiles.length, world.tiles[0].length, (cell, y, x) => {
      const tileType = world.tiles[y][x].type;

      cell.className = classes[tileType];

      cell.id = getCellId(x, y);
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
      onclick: () => {
        clearTimeout(timeoutId);
        stopButton.disabled = true;
        playButton.disabled = false;
      }
    });

    // const menu = createMenu();

    document.body.appendChild(table);
    document.body.appendChild(playButton);
    document.body.appendChild(stopButton);

    // gameLoop();
  },

  leave: _ => {
    document.body.innerHTML = '';
    clearTimeout(timeoutId);
  }
};
