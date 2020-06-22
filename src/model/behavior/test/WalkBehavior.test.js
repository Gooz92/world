import createWalkBehavior from '../WalkBehavior.js';
import World from 'model/World.js';
import { generateArray, last } from 'utils/common/array.utils.js';
import { getObject } from 'utils/common/fn.utils.js';
import ObjectType from 'model/ObjectType.enum.js';

import {
  calculateDirections
} from 'utils/path-finding/path-finding.test-utils.js';
import deepEqual from 'utils/common/deep-equal.js';

describe('WalkBehavior', function () {

  it('actor with this behavior should go throught given path', () => {
    const tiles = generateArray(9, 16, getObject);
    const world = new World(tiles);

    const path = calculateDirections([ [ 3, 4 ], [ 4, 4 ] ]);
    const person = world.place(2, 3, ObjectType.PERSON);
    person.setBehavior(createWalkBehavior, { path });

    while (person.isMoving()) {
      world.tick();
    }

    deepEqual(person.position, last(path).position);
  });

});
