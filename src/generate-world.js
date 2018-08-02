import { generateArray, randomInt } from './utils.js';
import { EMPTY } from './const.js';

const TREE = 3;
const MAN = 7;

const WIDTH = 128;
const HEIGHT = 64;

export function generateWorld() {
  const world = generateArray(HEIGHT, _ => generateArray(WIDTH, _ => ({
    type: EMPTY
  })));
  
  const trees = new Set();
  
  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      if (Math.random() < 0.05) {
        world[i][j] = { type: TREE, wood: 10 };
        trees.add(`${i}-${j}`);
      }
    }
  }
  
  let i, j;
  
  do {
    i = randomInt(HEIGHT / 3, 2 * HEIGHT / 3);
    j = randomInt(HEIGHT / 3, 2 * HEIGHT / 3);
  } while (!trees.has(`${i}-${j}`));
  
  world[i][j] = { type: MAN };

  return {
    man: [ j, i ],
    cells: world
  };
}
