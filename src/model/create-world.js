import { generateArray } from 'utils/array.utils.js';
import { getObject } from 'utils/fn.utils.js';

import World from './World.js';

export default function createWorld(seed) {

  const tiles = generateArray(48, () => generateArray(64, getObject));

  return new World(tiles);
}
