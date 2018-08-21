import generateWorld from '../generate-world.js';
import step from '../step.js';
import TILE_TYPES from '../tile-types.js';
import { createTable } from '../utils/dom.utils.js';

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
  const startCell = getCell(from.x, from.y);
  const endCell = getCell(to.x, to.y);

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
    
    let pos = { x: world.man[0], y: world.man[1] };

    function gameLoop() {

      const nextPos = step(world);

      console.log(`TICK`);

      if (nextPos) {
        pos = viewMove(pos, nextPos, 'person');
      }

      timeoutId = setTimeout(gameLoop, TICK_TIME);
    }

    const table = createTable(world.cells.length, world.cells[0].length, (cell, y, x) => {
      const cellType = world.cells[y][x].type;
    
      cell.className = classes[cellType];
    
      cell.id = getCellId(x, y);
    });
    
    document.body.appendChild(table);
    gameLoop();
  },

  leave: _ => {
    document.body.innerHTML = '';
    clearTimeout(timeoutId);
  }
};
