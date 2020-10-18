import createWalkBehavior from '../WalkBehavior.js';
import ObjectType from 'model/ObjectType.enum.js';

import {
  buildPath
} from 'utils/path-finding/path-finding.test-utils.js';

import deepEqual from 'utils/common/deep-equal.js';
import { createEmptyWorld } from 'model/world/World.test-utils.js';
import { last } from 'utils/common/array.utils.js';
import { isTrue } from 'utils/common/assertion.js';

describe('WalkBehavior', function () {

  it('actor with this behavior should go throught given path', () => {
    const world = createEmptyWorld(16, 9);

    const path = buildPath([ [ 3, 4 ], [ 4, 4 ] ]);
    const person = world.place(2, 3, ObjectType.PERSON);
    person.setBehavior(createWalkBehavior, { path });

    while (person.isMoving()) {
      world.tick();
    }

    deepEqual(person.position, last(path).position);
  });

  it('switch actor to idle state when path is walked', () => {
    const world = createEmptyWorld(16, 9);

    const path = buildPath([ [ 3, 4 ], [ 4, 4 ] ]);
    const person = world.place(2, 3, ObjectType.PERSON);
    person.setBehavior(createWalkBehavior, { path });

    while (person.isMoving()) {
      world.tick();
    }

    isTrue(person.isIdle());
  });

});
