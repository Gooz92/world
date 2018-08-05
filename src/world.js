import generateWorld from './generate-world.js';
import step from './step.js';
import TILE_TYPES from './tile-types.js';
import { createTable } from './dom.utils.js';

const world = generateWorld(64, 64, [
  [ 10, TILE_TYPES.EMPTY ],
  [ 3, TILE_TYPES.TREE ],
  [ 1, TILE_TYPES.OBSTACLE ]
]);

const getCellId = (x, y) => `tile-${x}-${y}`;

const classes = [ 'empty', 'obstacle', 'tree', 'person' ];

const table = createTable(world.cells.length, world.cells[0].length, (cell, y, x) => {
  const cellType = world.cells[y][x].type;

  cell.className = classes[cellType];

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
  getCell(...pos).className = 'person';

  setTimeout(gameLoop, 150);
}

export default function () {
  document.body.appendChild(table);
  gameLoop();
}
