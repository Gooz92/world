import { generateWorld } from './generate-world.js';
import { createTable } from './dom.utils.js';
import step from './step.js';

const world = generateWorld();

const table = createTable(world.cells.length, world.cells[0].length, (cell, y, x) => {
  if (world.cells[y][x].type === 3) {
    cell.className = 'tree';
  } else if (world.cells[y][x].type === 7) {
    cell.className = 'man';
  }

  cell.id = `tile-${x}-${y}`;
});

let pos = world.man;

function gameLoop() {

  document.getElementById(`tile-${pos[0]}-${pos[1]}`).className = '';
  pos = step(world);
  document.getElementById(`tile-${pos[0]}-${pos[1]}`).className = 'man';

  setTimeout(gameLoop, 300);
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(table);
  gameLoop();
});
