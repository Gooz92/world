import * as utils from './utils.js';
import { generateArray } from 'utils/common/array.utils.js';
import { getObject } from 'utils/common/fn.utils.js';
import World from 'model/World.js';
import { deepEqual } from 'utils/common/assertion.js';
import ObjectType from 'model/ObjectType.enum.js';

describe('findStockTile', function () {
  const findStockTile = utils.findStockTile;

  const worldWidth = 16, worldHeight = 9;
  const stockX = 3, stockY = 2;
  const stockWidth = 7, stockHeight = 5;

  const tiles = generateArray(worldHeight, worldWidth, getObject);

  const world = new World(tiles);

  world.placeArea(stockX, stockY, stockWidth, stockHeight, { terrain: ObjectType.STOCK });

  /*
    0 1 2 3 4 5 6 7 8 9
    . . . . . . . . . . . . . . . . 0
    . . . . . . . . . . . . . . . . 1
    . . . # # # # # # # . . . . . . 2
    . . . # # # # # # # . . . . . . 3
    . . . # # # + # # # . . . . . . 4
    . . . # # # # # # # . . . . . . 5
    . . . # # # # # # # . . . . . . 6
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
*/

  it.skip('works', () => {
    const p = findStockTile(stockX + 1, stockY, tiles);
    deepEqual(p, [ 6, 4 ]);
  });

});
