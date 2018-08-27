import findPath from '../find-path.js'
import { isUndefined } from '../utils/is.utils.js';
import TILE_TYPES from '../tile-types.js';

const isDiagonal = ([ x1, y1 ], [ x2, y2 ]) => (
  Math.abs(x1 - x2) > 0 && Math.abs(y1 - y2) > 0
);

const isTreeFound = (x, y, tiles) => (
  tiles[y][x].type === TILE_TYPES.TREE
);

const isPassable = (x, y, tiles) => (
  tiles[y][x].type !== TILE_TYPES.OBSTACLE
);

export default class Person {

  constructor(world, position) {
    this.world = world;
    this.position = position;
  }

  move() {
    const prevPos = this.position;
    this.position = this.nextPosition;

    if (this.path.length === 0) {
      this.path = null;
    }

    const [ nextX, nextY ] = this.nextPosition;
    this.world[nextY][nextX].type = TILE_TYPES.PERSON;

    this.nextPosition = null;
    this.idleTime = 0;

    const [ x, y ] = this.position;

    // command
    return {
      type: 'MOVE',
      to: { x, y },
      from: { x: prevPos[0], y: prevPos[1] }
    };
  }

  act() {

    const [ x, y ] = this.position;

    if (!this.path) {
      this.path = findPath(this.world, x, y, isTreeFound, isPassable);
    }

    if (isUndefined(this.idleTime)) {
      this.idleTime = 0;
    }

    if (!this.nextPosition) {
      this.nextPosition = this.path.shift();
    } else {
      ++this.idleTime;
      if (isDiagonal([ x, y ], this.nextPosition)) {
        if (this.idleTime === 2) return this.move();
      } else {
        if (this.idleTime === 1) return this.move();
      }
    }

    return { type: 'IDLE' };
  }
}
