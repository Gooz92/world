import generateWorld from './generate-world.js';
import step from './step.js';
import TILE_TYPES from './tile-types.js';
import { createTable } from './dom.utils.js';

const world = generateWorld(64, 64, 0.8);

const getCellId = (x, y) => `tile-${x}-${y}`;

const table = createTable(world.cells.length, world.cells[0].length, (cell, y, x) => {
  const cellType = world.cells[y][x].type;

  if (cellType === TILE_TYPES.TREE) {
    cell.className = 'tree';
  } else if (cellType === TILE_TYPES.PERSON) {
    cell.className = 'man';
  }

  cell.id = getCellId(x, y);
});

let pos = world.man;

function getCell(x, y) {
  const cellId = getCellId(x, y);
  return document.getElementById(cellId);
}

function gameLoop() {

  getCell(...pos).className = '';
  pos = step(world);
  getCell(...pos).className = 'man';

  setTimeout(gameLoop, 150);
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(table);
  gameLoop();
});
