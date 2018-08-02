import { generateArray, randomInt } from './utils.js';
import TILE_TYPES from './tile-types.js';

export default function generateWorld(width, height, treesDensity) {
  const world = generateArray(height, _ => generateArray(width, _ => ({
    type: TILE_TYPES.EMPTY
  })));
  
  const trees = new Set();
  
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (Math.random() < treesDensity) {
        world[i][j] = { type: TILE_TYPES.TREE, wood: 10 };
        trees.add(`${i}-${j}`);
      }
    }
  }

  let i, j;
  
  do {
    i = randomInt(height / 3, 2 * width / 3);
    j = randomInt(height / 3, 2 * width / 3);
  } while (!trees.has(`${i}-${j}`));
  
  world[i][j] = { type: TILE_TYPES.PERSON };

  return {
    man: [ j, i ],
    cells: world
  };
}
