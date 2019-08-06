import { generateArray } from 'utils/common/array.utils.js';
import { getObject } from 'utils/common/fn.utils.js';
import World from 'model/World.js';
import { equal } from 'utils/common/assertion.js';
import Direction from 'model/Direction.enum.js';

describe('WalkStrategy', function () {

  it('actor with this strategy should follow given path', () => {
    const tiles = generateArray(12, 8, getObject);
    const world = new World(tiles);
    const person = world.placePerson(2, 3);

    person.setStrategy('walk', {
      path: [{ position: [ 3, 4 ], direction: Direction.SOUTH_EAST }]
    });

    const strategy = person.strategy;

    do {
      person.act();
    } while (!strategy.action.completed);

    const tile = world.getTile(3, 4);

    equal(tile.object, person);
  });

});
