import { generateArray } from 'utils/array.utils.js';
import { getObject } from 'utils/fn.utils.js';

import World from './World.js';

export default function createWorld() {

  const tiles = generateArray(288, () => generateArray(384, getObject));

  return new World(tiles);
}
