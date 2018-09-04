import { distributionRandom, randomInt } from './utils/random.utils.js';
import { generateArray } from './utils/array.utils.js';
import Person from './model/Person.js';

const hash = (x, y) => `${x}-${y}`;

function generateRandomPoints(count, minX, maxX, minY, maxY, occupied) {
  const points = new Map();

  while (count-- > 0) {
    let x, y, k;
    do {
      x = randomInt(minX, maxX);
      y = randomInt(minY, maxY);
      k = hash(x, y);
    } while (!occupied.has(k) && !points.has(k));

    points.set(k, [ x, y ]);
  }

  return Array.from(points.values());
}

export default function generateWorld(width, height, obejctDistribution) {
  const world = generateArray(height, y => (
    generateArray(width, x => ({}))
  ));

  const occupied = new Set();
  const getObjectCreator = distributionRandom(obejctDistribution);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const createObject = getObjectCreator();
      const object = createObject();
      world[y][x].object = object;

      if (object !== null) {
        occupied.add(hash(x, y));
      }
    }
  }

  const points = generateRandomPoints(3, width / 3, 2 * width / 3,
      height / 3, 2 * height / 3, occupied);

  const people = points.map(position => {
    const person = new Person(world, position);
    person.setStrategy('cutTrees');

    return person;
  });

  people.forEach(person => {
    const [ x, y ] = person.position;
    world[y][x].object = person;
  });

  return {
    objects: people,
    tiles: world
  };
}
