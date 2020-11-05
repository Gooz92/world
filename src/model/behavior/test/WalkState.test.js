import WalkState from '../WalkState.js';

import ObjectType from 'model/ObjectType.enum.js';

import { deepEqual, equal } from 'utils/common/assertion.js';
import Direction from 'model/Direction.enum.js';

import { createEmptyWorld } from 'model/world/World.test-utils.js';
import { buildPath } from 'utils/path-finding/path-finding.test-utils.js';
import createWalkBehavior from '../WalkBehavior.js';

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

  describe('#getFurtherPath()', () => {

    let world;

    beforeEach(() => {
      world = createEmptyWorld(8, 12);
    });

    it('return empty array if next path node is unreachable in given time', () => {
      const person = world.place(2, 2, ObjectType.PERSON);

      const walkState = new WalkState(person, {
        path: buildPath([ [ 3, 3 ] ], Direction.SOUTH_EAST)
      });

      const path = walkState.getFurtherPath(2);

      equal(path.length, 0);
    });

    it('return next half-position and path node if it reachable in given time', () => {
      const person = world.place(2, 2, ObjectType.PERSON);

      const walkState = new WalkState(person, {
        path: buildPath([ [ 2, 3 ] ], Direction.SOUTH)
      });

      const path = walkState.getFurtherPath(2);

      deepEqual(path, [
        { position: [ 2, 2.5 ], direction: Direction.SOUTH, time: 2 },
        { position: [ 2, 3 ], direction: Direction.SOUTH, start: 2 }
      ]);
    });

    it('return path nodes and half-positions which can be passed in given time', () => {
      const person = world.place(2, 2, ObjectType.PERSON);

      const walkState = new WalkState(person, {
        path: buildPath(
          [
            [ 3, 3 ], // 3
            [ 4, 4 ], // 6
            [ 4, 5 ] // 8
          ],
          Direction.EAST
        )
      });

      const path = walkState.getFurtherPath(9);

      deepEqual(path, [
        { position: [ 2.5, 2.5 ], direction: Direction.SOUTH_EAST, time: 3 },
        { position: [ 3, 3 ], direction: Direction.SOUTH_EAST, start: 3, end: 5 },
        { position: [ 3.5, 3.5 ], direction: Direction.SOUTH_EAST, time: 6 },
        { position: [ 4, 4 ], direction: Direction.SOUTH_EAST, start: 6, end: 7 },
        { position: [ 4, 4.5 ], direction: Direction.SOUTH, time: 8 },
        { position: [ 4, 5 ], direction: Direction.SOUTH, start: 8 }
      ]);

    });
  });

  describe('#lookAhead()', function () {

    let world;

    beforeEach(() => {
      world = createEmptyWorld(8, 12);
    });

    it('works', () => {
      const walker = world.place(3, 3, ObjectType.PERSON);
      walker.setBehavior(createWalkBehavior, {
        path: buildPath([ [ 3, 4 ], [ 3, 5 ], [ 3, 6 ], [ 2, 5 ] ], Direction.SOUTH)
      });

      const idler = world.place(3, 6, ObjectType.PERSON);

      const [ obstacle ] = walker.getState().lookAhead();

      equal(idler, obstacle);
    });

  });

});
