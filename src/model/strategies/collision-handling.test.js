import { COLLISIONS } from './test-cases.js';

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
  calculateDirections,
  addWalls
} from 'utils/path-finding/path-finding.test-utils.js';

import WalkStrategy from './WalkStrategy.js';
import MoveAction from 'model/actions/MoveAction.js';
import ObjectType from 'model/ObjectType.enum.js';

function isActorHaveSamePositions(a, b) {
  return isArraysEqual(a.position, b.position);
}

function testCollision(pathes, idlers, width, height, maxTicks = 20) {
  const tiles = generateArray(height, width, getObject);

  addWalls(tiles);

  const world = new World(tiles);

  const walks = pathes.map(path => {
    const [ x, y ] = path[0];
    const person = world.place(x, y, ObjectType.PERSON);
    const direction = Direction.fromPoints(path[0], path[1]);
    person.setStrategy(WalkStrategy, {
      // walking path should not include start actor position
      path: calculateDirections(path.slice(1), direction)
    });

    return { actor: person, goal: last(path) };
  });

  idlers.forEach(([ x0, y0 ]) => {
    world.place(x0, y0, ObjectType.PERSON);
  });

  const actualPathes = generateArray(world.actors.length, getArray);

  let ticks = 0;

  while (ticks++ <
      maxTicks && walks.some(({ actor, goal }) => !isArraysEqual(actor.position, goal))) {

    const actions = world.tick();

    const moves = actions.filter(action => action.type === MoveAction.TYPE);

    isTrue(isUnique(world.actors, isActorHaveSamePositions));

    moves.forEach(move => {
      actualPathes[world.actors.indexOf(move.actor)].push(move.tiles[1]);
    });
  }

  isTrue(ticks < maxTicks, 'max ticks reached (deadlock?)');
  isTrue(actualPathes.every(path => isValidPath(path)), 'some path is wrong');
}

describe('collison handling', function () {

  COLLISIONS.forEach(testCase => {
    it(testCase.name, () => {
      const { walks, idlers = [], width, height } = testCase.data;
      testCollision(walks, idlers, width, height);
    });
  });

});

