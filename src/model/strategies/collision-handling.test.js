import World from 'model/World.js';

import {
  generateArray,
  isArraysEqual,
  last,
  isUnique
} from 'utils/common/array.utils.js';

import { getObject, getArray } from 'utils/common/fn.utils.js';
import Direction from 'model/Direction.enum.js';
import { isTrue } from 'utils/common/assertion.js';

import {
  isValidPath,
  calculateDirections
} from 'utils/path-finding/path-finding.test-utils.js';
import WalkStrategy from './WalkStrategy.js';
import MoveAction from 'model/actions/MoveAction.js';
import ObjectType from 'model/ObjectType.enum.js';

function isActorHaveSamePositions(a, b) {
  return isArraysEqual(a.position, b.position);
}

function addWalls(tiles) {

  for (let i = 0; i < tiles[0].length; i++) {
    tiles[0].object = { type: ObjectType.OBSTACLE };
  }

  for (let i = 1; i < tiles.length - 1; i++) {
    tiles[i][0].object = { type: ObjectType.OBSTACLE };
    tiles[i][tiles[i].length - 1].object = { type: ObjectType.OBSTACLE };
  }

  const lastRow = tiles[tiles.length - 1];

  for (let i = 0; i < lastRow.length; i++) {
    lastRow[i].object = { type: ObjectType.OBSTACLE };
  }
}

function testCollision(pathes, width, height) {
  const tiles = generateArray(height, width, getObject);
  addWalls(tiles);
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

    isTrue(isUnique(world.actors, isActorHaveSamePositions));

    moves.forEach(move => {
      actualPathes[world.actors.indexOf(move.actor)].push(move.tiles[1]);
    });
  }

  isTrue(actualPathes.every(path => isValidPath(path)), 'some path is wrong');
}

describe('collison handling', function () {

  it('vertical collision (try to occupy same tile [ 3, 4 ])', () => {

    testCollision([
      [ [ 3, 2 ], [ 3, 3 ], [ 3, 4 ], [ 3, 5 ], [ 3, 6 ] ],
      [ [ 3, 6 ], [ 3, 5 ], [ 3, 4 ], [ 3, 3 ], [ 3, 2 ] ]
    ], 7, 9);

  });

  it.skip('vertical collision (try to occupy each other tiles)', () => {

    testCollision([
      [ [ 3, 2 ], [ 3, 3 ], [ 3, 4 ], [ 3, 5 ], [ 3, 6 ], [ 3, 7 ] ],
      [ [ 3, 7 ], [ 3, 6 ], [ 3, 5 ], [ 3, 4 ], [ 3, 3 ], [ 3, 2 ] ]
    ], 7, 10);

  });

  it.skip('diagonal collision try to occupy same tile [ 4, 4 ]', () => {

    testCollision([
      [ [ 2, 2 ], [ 3, 3 ], [ 4, 4 ], [ 5, 5 ], [ 6, 6 ] ],
      [ [ 6, 6 ], [ 5, 5 ], [ 4, 4 ], [ 3, 3 ], [ 2, 2 ] ]
    ], 8, 8);

  });

  it.skip('diagonal collision try to occupy each other tiles', () => {

    testCollision([
      [ [ 2, 2 ], [ 3, 3 ], [ 4, 4 ], [ 5, 5 ], [ 6, 6 ], [ 7, 7 ] ],
      [ [ 7, 7 ], [ 6, 6 ], [ 5, 5 ], [ 4, 4 ], [ 3, 3 ], [ 2, 2 ] ]
    ], 9, 9);

  });

});
