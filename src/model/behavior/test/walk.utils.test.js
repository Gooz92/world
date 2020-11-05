import ObjectType from 'model/ObjectType.enum.js';
import { createEmptyWorld } from 'model/world/World.test-utils.js';

import { deepEqual } from 'utils/common/assertion.js';
import Direction from 'model/Direction.enum.js';
import { buildPath } from 'utils/path-finding/path-finding.test-utils.js';

import * as walkUtils from '../walk.utils.js';
import createWalkBehavior from '../WalkBehavior.js';

describe('walkUtils', function () {

  describe('.getPathIntersection()', function () {
    const { getPathIntersection } = walkUtils;

    let world;

    beforeEach(() => {
      world = createEmptyWorld(8, 12);
    });

    it('works', () => {
      const dude1 = world.place(3, 1, ObjectType.PERSON);
      const dude2 = world.place(1, 3, ObjectType.PERSON);

      dude1.setBehavior(createWalkBehavior, {
        path: buildPath(
          [
            [ 2, 1 ],
            [ 1, 1 ],
            [ 0, 1 ]
          ],
          Direction.WEST
        )
      });

      dude2.setBehavior(createWalkBehavior, {
        path: buildPath(
          [
            [ 1, 2 ],
            [ 1, 1 ],
            [ 1, 0 ]
          ],
          Direction.NORTH
        )
      });

      const p = getPathIntersection(dude1, dude2, 6);
      deepEqual(p, {
        position: [ 1, 1 ],
        isFrontal: false
      });
    });

  });

});
