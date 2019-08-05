import diamondSquareGenerator from 'utils/common/DiamondSquareGenerator.js';
import { normalize, getIndex } from 'utils/common/math.utils.js';
import { generateArray } from 'utils/common/array.utils.js';

import World from './World.js';
import ObjectType from 'model/ObjectType.enum.js';
import { randomGenerator } from 'utils/common/random.utils.js';
import { getObject } from 'utils/common/fn.utils.js';

const generator = diamondSquareGenerator()
  .setCellSize(32)
  .setRows(16)
  .setCols(18)
  .build();

const { width, height } = generator.size;

function createTiles(seed, empty) {

  if (empty) {
    return generateArray(height, width, getObject);
  }

  const random = randomGenerator(seed);

  const map = normalize(
    generator.generate(1, 42).map(i => Math.sqrt(i * i * i)), 1
  ).map(i => random.nextBoolean(0.4 * i));

  return generateArray(height, y => (
    generateArray(width, x => ({
      object: map[getIndex(x, y, width, height)] ? { type: ObjectType.TREE } : null
    }))));
}

export default function createWorld({ seed, empty }) {

  const tiles = createTiles(seed, empty);
  const world = new World(tiles);

  return world;
}
