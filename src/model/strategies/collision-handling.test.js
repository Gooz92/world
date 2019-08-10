import World from 'model/World.js';

import {
  generateArray,
  isUnique,
  isArraysEqual,
  last
} from 'utils/common/array.utils.js';

import { getObject, getArray } from 'utils/common/fn.utils.js';
import Direction from 'model/Direction.enum.js';
import { isTrue } from 'utils/common/assertion.js';

import {
  isContinuous,
  calculateDirections
} from 'utils/path-finding/path-finding.test-utils.js';

const isActorPositionsEqual = (a, b) => (
  isArraysEqual(a.position, b.position)
);

function testCollision(pathes, width, height) {
  const tiles = generateArray(height, width, getObject);
  const world = new World(tiles);

  const walks = pathes.map(path => {
    const [ x, y ] = path[0];
    const person = world.placePerson(x, y);
    const direction = Direction.fromPoints(path[0], path[1]);
    person.setStrategy('walk', {
      // walking path should not include start actor position
      path: calculateDirections(path.slice(1), direction)
    });

    return { actor: person, goal: last(path) };
  });

  const actualPathes = generateArray(pathes.length, getArray);

  while (walks.some(({ actor, goal }) => !isArraysEqual(actor.position, goal))) {
    const actions = world.tick();
    isTrue(isUnique(world.actors, isActorPositionsEqual));

    // TODO
    const moves = actions.filter(action => action.tiles.length > 0);

    moves.forEach(move => {
      actualPathes[world.actors.indexOf(move.actor)].push(move.tiles[1]);
    });
  }

  isTrue(pathes.every(path => isContinuous(path)));
}

describe('collison handling', function () {


  it('head-on collision (vertical)', () => {

    testCollision([
      [ [ 2, 1 ], [ 2, 2 ], [ 2, 3 ], [ 2, 4 ], [ 2, 5 ] ],
      [ [ 2, 5 ], [ 2, 4 ], [ 2, 3 ], [ 2, 2 ], [ 2, 1 ] ]
    ], 5, 7);

  });
});
