import { createClosedEmptyWorld } from 'model/world/World.test-utils.js';
import { remove } from 'utils/common/array.utils.js';
import createWalkBehavior from '../WalkBehavior';
import { calculateDirections } from 'utils/path-finding/path-finding.test-utils';
import Direction from 'model/Direction.enum';
import ObjectType from 'model/ObjectType.enum';

export function createWorldWithWalkers(walks, width, height) {

  const world = createClosedEmptyWorld(width, height);

  walks.forEach(walk => {
    const [ x, y ] = remove(walk, 0);
    const person = world.place(x, y, ObjectType.PERSON);

    const startDirection = Direction.fromPoints(person.position, walk[0]);
    const path = calculateDirections(walk, startDirection);

    person.setBehavior(createWalkBehavior, { path });
  });

  return world;
}