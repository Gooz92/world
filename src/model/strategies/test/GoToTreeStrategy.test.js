import World from 'model/World.js';

import { generateArray } from 'utils/common/array.utils.js';
import { getObject } from 'utils/common/fn.utils.js';
import ObjectType from 'model/ObjectType.enum';
import GoToTreeStrategy from '../CutTreesStrategy';
import { equal } from 'utils/common/assertion';
import deepEqual from 'utils/common/deep-equal';

describe('GoToTreeStrategy', function () {

  describe('.findTree()', function () {

    const worldWidth = 8, worldHeight = 6;
    const treeX = 4, treeY = 2;

    const tiles = generateArray(worldHeight, worldWidth, getObject);
    const world = new World(tiles);

    world.place(treeX, treeY, ObjectType.TREE);

    it('near tree', () => {
      const { path, treePosition } = GoToTreeStrategy.findTree(treeX - 1, treeY, tiles);

      equal(path.length, 0);
      deepEqual(treePosition, [ treeX, treeY ]);
    });

  });

});
