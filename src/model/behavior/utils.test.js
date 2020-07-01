import * as utils from './utils.js';
import { deepEqual } from 'utils/common/assertion.js';
import ObjectType from 'model/ObjectType.enum.js';
import { createEmptyWorld } from 'model/world/World.test-utils.js';

describe('findStockTile', function () {
  const findStockTile = utils.findStockTile;

  const worldWidth = 16, worldHeight = 9;
  const stockX = 3, stockY = 2;
  const stockWidth = 7, stockHeight = 5;

  const world = createEmptyWorld(worldWidth, worldHeight);

  world.placeArea(stockX, stockY, stockWidth, stockHeight, { terrain: ObjectType.STOCK });

  /*
    0 1 2 3 4 5 6 7 8 9
    . . . . . . . . . . . . . . . . 0
    . . . . . . . . . . . . . . . . 1
    . . . + # # # # # # . . . . . . 2
    . . . # # # # # # # . . . . . . 3
    . . . # # # # # # # . . . . . . 4
    . . . # # # # # # # . . . . . . 5
    . . . # # # # # # # . . . . . . 6
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
*/

  it('works', () => {
    const p = findStockTile(stockX + 1, stockY, world);
    deepEqual(p, [ stockX, stockY ]);
  });

});
