import { createTable } from '../utils/dom.utils.js';
import { generateArray } from '../utils/array.utils.js';
import findPath from '../find-path.js';

const WIDTH = 68;
const HEIGHT = 70;

const START = 3;
const END = 4;

const START_X = 5;
const START_Y = 15;

const END_X = 62;
const END_Y = 65;

const objects = [
  { position: [ START_X, START_Y ], type: START },
  { position: [ END_X, END_Y ], type: END }
];

const world = generateArray(HEIGHT, y => (
  generateArray(WIDTH, x => {
    const object = objects.find(o => {
      const [ x0, y0 ] = o.position;
      return x0 === x && y0 === y;
    });

    return object ? object.type : 0;
  })
));

const path = findPath(world, START_X, START_Y, (x, y, tiles) => tiles[y][x] === END, _ => true);

export default function () {
  const cells = [];

  const table = createTable(HEIGHT, WIDTH, (cell, y, x) => {
    const tile = world[y][x];

    (cells[y] || (cells[y] = []))[x] = cell;
    
    if (tile === 0) return;

    if (tile === 3) cell.style.backgroundColor = 'red';
    if (tile === 4) cell.style.backgroundColor = 'green';
  });

  path.forEach(([ x, y ]) => {
    cells[y][x].style.backgroundColor = 'gray';
  });

  document.body.appendChild(table);
}
