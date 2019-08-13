import { generateArray, isArraysEqual } from 'utils/common/array.utils.js';
import { getObject } from 'utils/common/fn.utils.js';
import World from 'model/World.js';
import { isTrue } from 'utils/common/assertion.js';
import Direction from 'model/Direction.enum.js';
import PatrolStrategy from './PatrolStrategy.js';
import { calculateDirections } from 'utils/path-finding/path-finding.test-utils.js';

describe('PatrolStrategy', function () {

  const path = calculateDirections([
    [ 2, 1 ], [ 3, 1 ], [ 4, 2 ], [ 4, 3 ],
    [ 3, 4 ], [ 2, 4 ], [ 1, 3 ], [ 1, 2 ]
  ], Direction.EAST);

  it('actor with this strategy should follow given path', () => {
    const tiles = generateArray(6, 6, getObject);
    const world = new World(tiles);
    const person = world.placePerson(1, 1);

    const controlTicks = [ 4, 9, 17, 24 ];
    const constrolPositions = [ 1, 3, 6, 1 ];

    person.setStrategy(PatrolStrategy, { path });

    for (let i = 0; i < 26; i++) {
      const tickIndex = controlTicks.indexOf(tickIndex);
      if (tickIndex > -1) {
        const positionIndex = constrolPositions[tickIndex];
        const { position } = path[positionIndex];
        isTrue(isArraysEqual(person.position, position));
      }
      person.act();
    }
  });

});
