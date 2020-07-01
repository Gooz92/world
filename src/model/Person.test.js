import ObjectType from './ObjectType.enum.js';

import { createEmptyWorld } from './world/World.test-utils.js';
import { equal, isTrue } from 'utils/common/assertion.js';
import createWalkBehavior from './behavior/WalkBehavior.js';
import { calculateDirections } from 'utils/path-finding/path-finding.test-utils.js';

describe('Person', function () {

  let person;

  beforeEach(() => {
    const world = createEmptyWorld(4, 3);
    person = world.place(1, 2, ObjectType.PERSON);
  });

  describe('#isMoving()', function () {

    it('return true if actor has walk state which is not done', () => {
      person.setBehavior(createWalkBehavior, {
        path: calculateDirections([ [ 1, 2 ], [ 2, 1 ] ])
      });

      isTrue(person.isMoving());
    });

  });

  describe('#type', function () {

    it('eault to ObjectType.PERSON', () => {
      equal(person.type, ObjectType.PERSON);
    });

  });

});
