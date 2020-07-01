import createWalkBehavior from '../WalkBehavior.js';
import TEST_CASES from './collision-test-cases.js';

import { createEmptyWorld } from 'model/world/World.test-utils.js';
import { remove } from 'utils/common/array.utils.js';
import ObjectType from 'model/ObjectType.enum.js';
import { calculateDirections } from 'utils/path-finding/path-finding.test-utils.js';
import Direction from 'model/Direction.enum.js';

describe('Collision test', function () {

  TEST_CASES
    .filter(testCase => !testCase.skip)
    .forEach(testCase => {
      const { width, height } = testCase.data;

      const world = createEmptyWorld(width, height);

      testCase.data.walks.forEach(walk => {
        const [ x, y ] = remove(walk, 0);
        const person = world.place(x, y, ObjectType.PERSON);

        const startDirection = Direction.fromPoints(person.position, walk[0]);
        const path = calculateDirections(walk, startDirection);

        person.setBehavior(createWalkBehavior, { path });
      });
    });

});
