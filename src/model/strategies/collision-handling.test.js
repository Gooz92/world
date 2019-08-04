import World from 'model/World.js';
import { generateArray } from 'utils/common/array.utils';
import { getObject } from 'utils/common/fn.utils';
import WalkStrategy from './WalkStartegy';

const tiles = generateArray(7, 5, getObject);
const world = new World(tiles);

const p1 = [ 2, 1 ], p2 = [ 2, 5 ];

const [ x1, y1 ] = p1, [ x2, y2 ] = p2;

const firstWalker = world.placePerson(x1, y1);
const secondWalker = world.placePerson(x2, y2);

const createPathNode = position => ({ position });

const aPath = [ p1, [ 2, 2 ], [ 2, 3 ], [ 2, 4 ], p2 ].map(createPathNode);
const bPath = [ p2, [ 2, 4 ], [ 2, 3 ], [ 2, 2 ], p1 ].map(createPathNode);

const ticks = Math.max(aPath.length, bPath.length) * 2;

firstWalker.strategy = new WalkStrategy(world, firstWalker, {
  path: aPath
});

secondWalker.strategy = new WalkStrategy(world, secondWalker, {
  path: bPath
});

for (let i = 0; i < ticks; i++) {
  world.tick();
  console.log(firstWalker.position, secondWalker.position);
}