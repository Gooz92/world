import { createTable } from './dom.utils.js';
import { generateArray } from './utils.js';
import { findPath } from './find-path.js';
import { randomInt } from './utils.js';
import { EMPTY, WALL, START, END } from './const.js';

const SIZE = 40;

const field = generateArray(SIZE, _ => (
  generateArray(SIZE, _ => EMPTY)
));

const START_X = 5;
const START_Y = 5;

const END_X = 38;
const END_Y = 20;

field[START_Y][START_X] = START;
field[END_Y][END_X] = END;

const lmbs = generateLumberjacks(3, 10, 10, 20, 23);

function onCellCreated(cell, i, j) {

  cell.id = `tile-${j}-${i}`;
  cell.dataset.x = j;
  cell.dataset.y = i;
  
  if (i === START_Y && j === START_X) {
    cell.className = 'start';
  } else if (i === END_Y && j === END_X) {
    cell.className = 'end';
  } else {
    cell.addEventListener('click', ({ target }) => {
      const x = +target.dataset.x;
      const y = +target.dataset.y;
  
      const tile = field[y][x];
      
      if (tile === WALL) {
        field[y][x] = 0;
        target.className = '';
      } else {
        field[y][x] = 1;
        target.className = 'wall';
      }

      document.querySelectorAll('.path-node')
        .forEach(tile => {
          tile.className = '';
        });

      findPath(field, START_X, START_Y, (x, y) => field[y][x] === END)
        .forEach(([x, y]) => {
          document.getElementById(`tile-${x}-${y}`).className = 'path-node';           
        });
    });
  }
}

function generateLumberjacks(count, x1, y2, x2, y2) {
  const lumberjacks = [];

  for (let i = 0; i < count; i++) {
    let rx, ry;

    do {
      rx = randomInt(x1, x2);
      ry = randomInt(y1, y2);
    } while (!lumberjacks.find(([ x, y ]) => x === rx && y === ry));

    lumberjacks.push([ rx, ry ]);
  }

  return lumberjacks;
}

document.addEventListener('DOMContentLoaded', () => {
  const table = createTable(SIZE, SIZE, onCellCreated);
  document.body.appendChild(table);
});
