import World from 'model/World.js';

import {
  generateArray,
  isArraysEqual,
  last
} from 'utils/common/array.utils.js';

import { getObject, getArray } from 'utils/common/fn.utils.js';
import Direction from 'model/Direction.enum.js';
import { isTrue, isFalse } from 'utils/common/assertion.js';

import {
  isContinuous,
  calculateDirections
} from 'utils/path-finding/path-finding.test-utils.js';
import WalkStrategy from './WalkStrategy.js';
import MoveAction from 'model/actions/MoveAction.js';

// is walkers have same destination or a -> b, b -> a
function collided(m1, m2) {
  return isArraysEqual(m1[1], m2[1]) || (
    isArraysEqual(m1[0], m2[1]) && isArraysEqual(m1[1], m2[0])
  );
}

function testCollision(pathes, width, height) {
  const tiles = generateArray(height, width, getObject);
  const world = new World(tiles);

  const walks = pathes.map(path => {
    const [ x, y ] = path[0];
    const person = world.placePerson(x, y);
    const direction = Direction.fromPoints(path[0], path[1]);
    person.setStrategy(WalkStrategy, {
      // walking path should not include start actor position
      path: calculateDirections(path.slice(1), direction)
    });

    return { actor: person, goal: last(path) };
  });

  const actualPathes = generateArray(pathes.length, getArray);

  while (walks.some(({ actor, goal }) => !isArraysEqual(actor.position, goal))) {
    const actions = world.tick();

    const moves = actions.filter(action => action.type === MoveAction.TYPE);

    for (let i = 0; i < moves.length; i++) {
      const m1 = moves[i].tiles;
      for (let j = i + 1; j < moves.length; j++) {
        const m2 = moves[j].tiles;
        isFalse(collided(m1, m2), `collison: [${m1.join('; ')}] - [${m2.join('; ')}]`);
      }
    }

    moves.forEach(move => {
      actualPathes[world.actors.indexOf(move.actor)].push(move.tiles[1]);
    });
  }

  isTrue(actualPathes.every(path => isContinuous(path)), 'some path is wrong');
}

describe('collison handling', function () {

  it('vertical collision (try to occupy same tile [ 2, 3 ])', () => {

    testCollision([
      [ [ 2, 1 ], [ 2, 2 ], [ 2, 3 ], [ 2, 4 ], [ 2, 5 ] ],
      [ [ 2, 5 ], [ 2, 4 ], [ 2, 3 ], [ 2, 2 ], [ 2, 1 ] ]
    ], 5, 7);

  });

  it('vertical collision (try to occupy each other tiles)', () => {

    testCollision([
      [ [ 2, 1 ], [ 2, 2 ], [ 2, 3 ], [ 2, 4 ], [ 2, 5 ], [ 2, 6 ] ],
      [ [ 2, 6 ], [ 2, 5 ], [ 2, 4 ], [ 2, 3 ], [ 2, 2 ], [ 2, 1 ] ]
    ], 5, 9);

  });

  it('diagonal collision try to occupy same tile [ 4, 4 ]', () => {

    testCollision([
      [ [ 2, 2 ], [ 3, 3 ], [ 4, 4 ], [ 5, 5 ], [ 6, 6 ] ],
      [ [ 6, 6 ], [ 5, 5 ], [ 4, 4 ], [ 3, 3 ], [ 2, 2 ] ]
    ], 8, 8);

  });

  it('diagonal collision try to occupy each other tiles', () => {

    testCollision([
      [ [ 2, 2 ], [ 3, 3 ], [ 4, 4 ], [ 5, 5 ], [ 6, 6 ], [ 7, 7 ] ],
      [ [ 7, 7 ], [ 6, 6 ], [ 5, 5 ], [ 4, 4 ], [ 3, 3 ], [ 2, 2 ] ]
    ], 9, 9);

  });

});
