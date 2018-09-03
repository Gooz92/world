import direction from './model/direction.js';
import { getTrue } from './utils/fn.utils.js';
import backtracePath from './backtrace-path.js';
import { AXIAL_TILE_DISTANCE, DIAGONAL_TILE_DISTANCE } from './model/consts.js'

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

export default function findPath(field, x, y, isFound, isPassable = getTrue) {

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
      const [ nextX, nextY ] = nextPosition

      const isDiagonal = Math.abs(dx) > 0 && Math.abs(dy) > 0;

      if (!inBounds(nextX, nextY, field)) {
        continue;
      }

      if (isDiagonal &&
        !isPassable(currentX, nextY, field) &&
        !isPassable(nextX, currentY, field)) {
        continue;
      }

      const nextCost = visited[currentKey] + (
        isDiagonal ? DIAGONAL_TILE_DISTANCE : AXIAL_TILE_DISTANCE
      );

      const key = hash(nextX, nextY);

      const node = {
        position: nextPosition,
        previous: currentNode,
        cost: nextCost
      };

      if (isFound(nextX, nextY, field)) {
        if (isPassable(nextX, nextY, field)) {
          return backtracePath(node);
        } else {
          return backtracePath(currentNode);
        }
      }

      if (!isPassable(nextX, nextY, field)) {
        continue;
      }

      if (!visited[key] || nextCost < visited[key]) {
        visited[key] = nextCost;
        nodes.push(node);
      }
    }

  } while (nodes.length > 0);

  return [];
}
