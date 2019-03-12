import { chunk, generateArray } from 'utils/array.utils.js';
import { normalize } from 'utils/math.utils.js';
import { generate } from 'utils/diamond-square.js';
import { getObject } from 'utils/fn.utils.js';

import World from './World.js';
import ObjectType from './ObjectType.js';

export default function createWorld(seed) {

  const treeMap = chunk(
    normalize(generate(7, seed), 5)
      .map(h => Math.random() * 5 < h),
    256
  );

  const tiles = generateArray(256, 256, getObject);

  for (let i = 0; i < treeMap.length; i++) {
    for (let j = 0; j < treeMap[i].length; j++) {
      if (treeMap[i][j]) {
        tiles[i][j].object = { type: ObjectType.TREE };
      }
    }
  }

  return new World(tiles);
}
