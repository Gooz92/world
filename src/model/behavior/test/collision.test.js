import TEST_CASES from './collision-test-cases.js';

import { deepEqual } from 'utils/common/assertion.js';
import { createWorldWithWalkers } from './colllsion-test.utils.js';
import { last } from 'utils/common/array.utils.js';

describe('Collision test', function () {

  TEST_CASES
    .filter(testCase => !testCase.skip)
    .forEach(testCase => {

      describe(testCase.name, function () {

        const { walks, width, height } = testCase.data;

        const world = createWorldWithWalkers(walks, width, height);

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
