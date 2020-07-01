import WalkState from '../WalkState.js';

import ObjectType from 'model/ObjectType.enum.js';

import { deepEqual } from 'utils/common/assertion.js';
import Direction from 'model/Direction.enum.js';
import { createEmptyWorld } from 'model/world/World.test-utils.js';

describe('WalkState', function () {

  describe('.nextAction()', function () {

    it('return move to next path node action', () => {
      const world = createEmptyWorld(8, 12);
      const person = world.place(2, 3, ObjectType.PERSON);

      const walkState = new WalkState(person, {
        path: [
          { position: [ 3, 4 ], direction: Direction.SOUTH_EAST }
        ]
      });

      const moveAction = walkState.nextAction();

      deepEqual(moveAction.tiles[1], [ 3, 4 ]);
    });

  });

});
