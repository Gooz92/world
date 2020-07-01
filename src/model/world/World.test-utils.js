import World from './World.js';
import ObjectType from 'model/ObjectType.enum.js';

import { generateArray } from 'utils/common/array.utils.js';
import { getObject } from 'utils/common/fn.utils.js';

export function createEmptyWorld(width, height) {
  const tiles = generateArray(height, width, getObject);
  return new World(tiles);
}

/*
 * Most mechanics treart world as torus.
 * So in some cases useful to add obstacles on world border
 */

export function createClosedEmptyWord(width, height) {
  const maxX = width - 1, maxY = height - 1;

  const tiles = generateArray(height, y => (
    generateArray(width, x => (
      x === 0 || y === 0 || x === maxX || y === maxY ? {
        type: ObjectType.OBSTACLE
      } : {}
    ))
  ));

  return new World(tiles);
}
