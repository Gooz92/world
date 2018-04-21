import { createTable } from './dom.utils.js';
import { generateArray } from './utils.js';
import { findPath } from './find-path.js';

const SIZE = 40;

const field = generateArray(SIZE, _ => (
  generateArray(SIZE, _ => 0)
));

const START = 2;
const END  = 3;
const WALL = 1;

const START_X = 5;
const START_Y = 5;

const END_X = 30;
const END_Y = 30;

field[START_Y][START_X] = START;
field[END_Y][END_Y] = END;

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

document.addEventListener('DOMContentLoaded', () => {
  const table = createTable(SIZE, SIZE, onCellCreated);
  document.body.appendChild(table);
});
