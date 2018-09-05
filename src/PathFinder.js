import direction from './model/direction.js';
import { noop, getTrue, getFalse } from './utils/fn.utils.js';
import backtracePath from './backtrace-path.js';
import { AXIAL_TILE_DISTANCE, DIAGONAL_TILE_DISTANCE } from './model/consts.js';

const hash = (x, y) => `${x}-${y}`;

const inBounds = (x, y, field) => (
  x >= 0 && y >= 0 && y < field.length && x < field[y].length
);

function pickMin(array, getValue) {
  let value = getValue(array[0]);
  let index = 0;

  for (let i = 0; i < array.length; i++) {
    const nextValue = getValue(array[i]);
    if (nextValue < value) {
      value = nextValue;
      index = i;
    }
  }

  return array.splice(index, 1)[0];
}

const offsets = Object.keys(direction)
  .reduce((acc, directionName) => [ ...acc, direction[directionName] ], []);

export default class PathFinder {

  constructor(options) {

    Object.assign(this, {
      onAxialTile: noop,
      onDiagonalTile: noop,
      isTilePassable: getTrue,
      isTileFound: getFalse
    }, options);

    this.isFound = false;
    this.goal = null;
  }

  onTile(tile, x, y, isDiagonal) {
    if (isDiagonal) {
      this.onDiagonalTile(tile, x, y);
    } else {
      this.onAxialTile(tile, x, y);
    }

    if (this.isTileFound(tile, x, y)) {
      this.found(tile);
    }
  }

  found(goal) {
    this.goal = goal;
    this.isFound = true;
  }

  getResult(node) {
    const goal = this.goal;

    this.goal = null;
    this.isFound = false;

    return {
      goal: goal,
      path: backtracePath(node)
    };
  }

  find(tiles, x, y) {
    const visited = {
      [`${x}-${y}`]: 0
    };

    const nodes = [{
      position: [ x, y ],
      cost: 0
    }];

    do {
      // TODO: use priority queue
      const currentNode = pickMin(nodes, node => node.cost);
      const [ currentX, currentY ] = currentNode.position;
      const currentKey = hash(currentX, currentY);

      for (const [ dx, dy ] of offsets) {
        const nextPosition = [ currentX + dx, currentY + dy ];
        const [ nextX, nextY ] = nextPosition;

        if (!inBounds(nextX, nextY, tiles)) {
          continue;
        }

        const tile = tiles[nextY][nextX];

        const isDiagonal = Math.abs(dx) > 0 && Math.abs(dy) > 0;

        this.onTile(tile, nextX, nextY, isDiagonal);

        if (this.isFound) {
          return this.getResult(currentNode);
        }

        if (!this.isTilePassable(tile)) {
          continue;
        }

        const nextCost = visited[currentKey] + (
          isDiagonal ? DIAGONAL_TILE_DISTANCE : AXIAL_TILE_DISTANCE
        );

        const key = hash(nextX, nextY);

        if (!visited[key] || nextCost < visited[key]) {
          visited[key] = nextCost;
          nodes.push({
            position: nextPosition,
            previous: currentNode,
            cost: nextCost
          });
        }
      }
    } while (nodes.length > 0);

    return { path: [] };
  }
}
