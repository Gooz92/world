import { generateArray } from 'utils/common/array.utils.js';
import { getObject } from 'utils/common/fn.utils.js';

import World from './World.js';

export default function createWorld() {

  const tiles = generateArray(288, 384, getObject);

  return new World(tiles);
}
