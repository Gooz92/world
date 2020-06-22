import World from 'model/World.js';
import WalkState from '../WalkState.js';

import { generateArray } from 'utils/common/array.utils.js';
import { getObject } from 'utils/common/fn.utils.js';
import ObjectType from 'model/ObjectType.enum.js';

import { deepEqual } from 'utils/common/assertion.js';
import Direction from 'model/Direction.enum.js';

describe('WalkState', function () {

  describe('.nextAction()', function () {

    it('return move to next path node action', () => {
      const tiles = generateArray(12, 8, getObject);
      const world = new World(tiles);
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
