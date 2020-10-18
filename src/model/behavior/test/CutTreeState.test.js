import CutTreeState from '../CutTreeState.js';

import ObjectType from 'model/ObjectType.enum.js';

import { deepEqual } from 'utils/assertion.js';
import { createEmptyWorld } from 'model/world/World.test-utils.js';

describe('CutTreeState', function () {

  describe('.nextAction()', function () {

    it('return cut given tree action', () => {
      const world = createEmptyWorld(8, 12);
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
