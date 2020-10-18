import World from './World.js';
import ObjectType from 'model/ObjectType.enum.js';

import { generateArray } from 'utils/common/array.utils.js';
import { getObject } from 'utils/common/fn.utils.js';
import { forIn } from 'utils/common/object.utils.js';
import { buildPath } from 'utils/path-finding/path-finding.test-utils.js';
import Direction from 'model/Direction.enum.js';
import createWalkBehavior from 'model/behavior/WalkBehavior.js';
import createCutTreesBehavior from 'model/behavior/CutTreesBehavior.js';

export function createEmptyWorld(width, height) {
  const tiles = generateArray(height, width, getObject);
  return new World(tiles);
}

/*
 * Most mechanics treart world as torus.
 * So in some cases useful to add obstacles on world border
 */

export function createClosedEmptyWorld(width, height) {
  const maxX = width - 1, maxY = height - 1;

  const tiles = generateArray(height, width, (y, x) => ({
    object: x === 0 || y === 0 || x === maxX || y === maxY ?
      { type: ObjectType.OBSTACLE } : null
  }));

  return new World(tiles);
}

const customPlacers = {
  walks(world, walks) {
    walks.forEach(walk => {
      const [ x, y ]= walk[0];
      const person = world.place(x, y, ObjectType.PERSON);
      // path not include persons position
      const pathPositions = walk.slice(1, walk.length);
      const startDirection = Direction.fromPoints(walk[0], pathPositions[0]);
      const path = buildPath(pathPositions, startDirection);

      person.setBehavior(createWalkBehavior, { path });
    });
  },

  stock(world, rectangle) {
    const [ x, y, width, height ] = rectangle;
    world.placeArea(x, y, width, height, { terrain: ObjectType.STOCK });
  },

  woodcutters(world, positions) {
    positions.forEach(([ x, y ]) => {
      const person = world.place(x, y, ObjectType.PERSON);
      person.setBehavior(createCutTreesBehavior);
    });
  }
};

export function createWorld(config, width, height) {
  const createWorld = config.isClosed ? createClosedEmptyWorld : createEmptyWorld;
  const world = createWorld(width, height);

  forIn(config, (value, key) => {

    const type = ObjectType.fromName(key);

    if (type) {
      world.placeMultiple(value, type);
    } else {
      const placer = customPlacers[key];
      if (placer) {
        placer(world, value);
      }
    }
  });

  return world;
}

