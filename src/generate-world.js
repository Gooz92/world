import { distributionRandom, randomInt } from './utils/random.utils.js';
import { generateArray } from './utils/array.utils.js';
import TILE_TYPES from './tile-types.js';
import Person from './model/Person.js';

export const fromTileTypes = tiles => (
  tiles.map(row => row.map(type => ({ type })))
);

const hash = (x, y) => `${x}-${y}`;

function generateRandomPoints(count, minX, maxX, minY, maxY, occupied) {
  const points = [];

  while (count-- > 0) {
    let x, y;
    do {
      x = randomInt(minX, maxX);
      y = randomInt(minY, maxY);
    } while (!occupied.has(hash(x, y)));
  
    points.push([ x, y ]);
  }

  return points;
}

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

  const points = generateRandomPoints(3, width / 3, 2 * width / 3,
      height / 3, 2 * height / 3, occupied);
  
  const people = points.map(position => new Person(world, position));
  
  people.forEach(person => {
    const [ x, y ] = person.position;
    world[y][x] = { object: person };
  });

  return {
    objects: people,
    cells: world
  };
}
