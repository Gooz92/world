import { createTable } from './dom.utils.js';
import { generateArray } from './utils.js';
import { findPath } from './find-path.js';
import { randomInt } from './utils.js';

const SIZE = 32;

const field = smooth(generateArray(SIZE + 2, _ => (
  generateArray(SIZE + 2, _ => randomInt(0, 15))
)));

function smooth(array) {
  const smoothed = [];

  for (let i = 0; i < array.length - 1; i++) {
    smoothed.push([]);
    for (let j = 0; j < array[i].length - 1; j++) {
      smoothed[Math.floor(i / 2)][Math.floor(j / 2)] = Math.max(
        array[i][j], array[i][j + 1],
        array[i + 1][j], array[i + 1][j + 1]
      )
    }
  }

  debugger;
  return smoothed;
}

function onCellCreated(cell, i, j) {
  const grey = (17 * field[i][j]).toString(16);
  cell.style.backgroundColor = `#${generateArray(3, () => grey).join('')}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const table = createTable(SIZE, SIZE, onCellCreated);
  document.body.appendChild(table);
});
