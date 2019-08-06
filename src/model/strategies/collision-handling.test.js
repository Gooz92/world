import World from 'model/World.js';
import { generateArray } from 'utils/common/array.utils';
import { getObject } from 'utils/common/fn.utils';
import WalkStrategy from './WalkStartegy';
import Direction from 'model/Direction.enum.js';

const tiles = generateArray(7, 5, getObject);
const world = new World(tiles);

const p1 = [ 2, 1 ], p2 = [ 2, 5 ];

const [ x1, y1 ] = p1, [ x2, y2 ] = p2;

const firstWalker = world.placePerson(x1, y1);
const secondWalker = world.placePerson(x2, y2);

// path not include star actor position
const aPath = [ [ 2, 2 ], [ 2, 3 ], [ 2, 4 ], p2 ]
  .map(position => ({
    position,
    direction: Direction.SOUTH
  }));

const bPath = [ [ 2, 4 ], [ 2, 3 ], [ 2, 2 ], p1 ]
  .map(position => ({
    position,
    direction: Direction.NORTH
  }));

firstWalker.strategy = new WalkStrategy(world, firstWalker, {
  path: aPath
});

secondWalker.strategy = new WalkStrategy(world, secondWalker, {
  path: bPath
});


while (
  (firstWalker.position[0] !== p2[0] || firstWalker.position[1] !== p2[1]) &&
  (secondWalker.position[0] !== p1[0] || secondWalker.position[1] !== p1[1])
) {
  world.tick();
  console.log(firstWalker.position, secondWalker.position);
}
