import { generateArray, randomInt } from './utils.js';
import TILE_TYPES from './tile-types.js';

export default function generateWorld(width, height, treesDensity) {
  const world = generateArray(height, _ => generateArray(width, _ => ({
    type: TILE_TYPES.EMPTY
  })));
  
  const trees = new Set();
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (Math.random() < treesDensity) {
        world[y][x] = { type: TILE_TYPES.TREE, wood: 10 };
        trees.add(`${x}-${y}`);
      }
    }
  }

  let x, y;
  
  do {
    x = randomInt(height / 3, 2 * width / 3);
    y = randomInt(height / 3, 2 * width / 3);
  } while (!trees.has(`${x}-${y}`));
  
  world[y][x] = { type: TILE_TYPES.PERSON };

  return {
    man: [ x, y ],
    cells: world
  };
}
