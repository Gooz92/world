import { distributionRandom, randomInt } from './utils/random.utils.js';
import { generateArray } from './utils/array.utils.js';
import TILE_TYPES from './tile-types.js';

export const fromTileTypes = tiles => (
  tiles.map(row => row.map(type => ({ type })))
);

const hash = (x, y) => `${x}-${y}`;

export default function generateWorld(width, height, obejctDistribution) {
  const world = generateArray(height, _ => generateArray(width, _ => ({
    type: TILE_TYPES.EMPTY
  })));

  const occupied = new Set();
  const getNextTileType = distributionRandom(obejctDistribution);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const type = getNextTileType();
      world[y][x] = { type  };

      if (type !== TILE_TYPES.EMPTY)
        occupied.add(hash(x, y));
    }
  }

  let x, y;

  do {
    x = randomInt(height / 3, 2 * width / 3);
    y = randomInt(height / 3, 2 * width / 3);
  } while (!occupied.has(hash(x, y)));

  world[y][x] = { type: TILE_TYPES.PERSON };

  return {
    man: [x, y],
    cells: world
  };
}
