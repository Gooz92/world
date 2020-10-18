import WalkState from '../WalkState.js';

import ObjectType from 'model/ObjectType.enum.js';

import { deepEqual, equal } from 'utils/common/assertion.js';
import Direction from 'model/Direction.enum.js';

import { createEmptyWorld } from 'model/world/World.test-utils.js';
import { buildPath } from 'utils/path-finding/path-finding.test-utils.js';

describe('WalkState', function () {

  describe('#nextAction()', function () {

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

  describe('#lookup()', function () {

    let world;

    beforeEach(() => {
      world = createEmptyWorld(8, 12);
    });

    it('return null if no obstacle near on path', () => {
      const person = world.place(2, 3, ObjectType.PERSON);

      const walkState = new WalkState(person, {
        path: buildPath([ [ 3, 4 ] ], Direction.SOUTH_EAST)
      });

      equal(walkState.lookup(), null);
    });

    it('return obstacle on path (if there is one near)', () => {
      const person = world.place(3, 3, ObjectType.PERSON);

      const walkState = new WalkState(person, {
        path: buildPath([ [ 4, 4 ], [ 5, 5 ] ], Direction.SOUTH_EAST)
      });

      const obstacle = world.place(5, 5, ObjectType.OBSTACLE);

      equal(walkState.lookup(), obstacle);
    });

  });

});
