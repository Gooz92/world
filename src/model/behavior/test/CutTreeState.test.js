import World from 'model/World.js';
import CutTreeState from '../CutTreeState.js';

import { generateArray } from 'utils/common/array.utils.js';
import { getObject } from 'utils/common/fn.utils.js';
import ObjectType from 'model/ObjectType.enum.js';

import { deepEqual } from 'utils/common/assertion.js';

describe('CutTreeState', function () {

  describe('.nextAction()', function () {

    it('return cut given tree action', () => {
      const tiles = generateArray(12, 8, getObject);
      const world = new World(tiles);
      const person = world.place(3, 2, ObjectType.PERSON);

      const treePosition = [ 4, 2 ];
      const [ treeX, treeY ] = treePosition;

      world.place(treeX, treeY, ObjectType.TREE);

      const cutTreeState = new CutTreeState(person, { treePosition });

      const cutAction = cutTreeState.nextAction();

      deepEqual(cutAction.tiles[0], treePosition);
    });

  });

});
