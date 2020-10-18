import TEST_CASES from './collision-test-cases.js';

import { deepEqual } from 'utils/assertion.js';
import { last } from 'utils/common/array.utils.js';
import { createWorld } from 'model/world/World.test-utils.js';

describe('Collision test', function () {

  TEST_CASES
    .filter(testCase => !testCase.skip)
    .forEach(testCase => {

      describe(testCase.name, function () {

        const { width, height, ...config } = testCase.data;

        const world = createWorld(config, width, height);

        while (world.actors.some(person => person.isMoving())) {
          world.tick();
        }

        it('actors on target tiles', () => {
          world.actors.forEach((actor, index) => {
            deepEqual(actor.position, last(testCase.data.walks[index]));
          });
        });

      });

    });

});
