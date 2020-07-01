import World from './World.js';

import { generateArray } from 'utils/common/array.utils.js';
import { getObject } from 'utils/common/fn.utils.js';

export function createEmptyWorld(width, height) {
  const tiles = generateArray(height, width, getObject);
  return new World(tiles);
}
