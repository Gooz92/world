import { generateArray } from 'utils/array.utils.js';
import { getObject } from 'utils/fn.utils.js';

import World from './World.js';

export default function createWorld() {

  const tiles = generateArray(96, () => generateArray(128, getObject));

  return new World(tiles);
}
