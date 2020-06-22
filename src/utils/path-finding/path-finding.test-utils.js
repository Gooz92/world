import Direction from 'model/Direction.enum.js';
import ObjectType from 'model/ObjectType.enum.js';
import { last } from 'utils/common/array.utils.js';

function defaultSetData(node, data) {
  node.data = data;
}

export function buildLinkedList(array, setData = defaultSetData) {
  let previous = null, node;

  for (let i = 0; i < array.length; i++) {
    node = {};
    setData(node, array[i]);
    node.previous = previous;
    previous = node;
  }

  return node;
}

export function isValidPath(positions) {
  for (let i = 0; i < positions.length - 1; i++) {
    const [ x1, y1 ] = positions[i],
      [ x2, y2 ] = positions[i + 1];

    const dx = Math.abs(x1 - x2),
      dy = Math.abs(y1 - y2);

    if ((dx > 1 || dy > 1) || (dx === 0 && dy === 0)) {
      return false;
    }
  }

  return true;
}

export function calculateDirections(positions, startDirection) {
  const path = [{
    position: positions[0],
    direction: startDirection
  }];

  for (let i = 1; i < positions.length; i++) {
    path.push({
      position: positions[i],
      direction: Direction.fromPoints(positions[i - 1], positions[i])
    });
  }

  return path;
}

const createObstacle = () => ({ type: ObjectType.OBSTACLE });

export function addWalls(tiles) {
  for (let i = 0; i < tiles[0].length; i++) {
    tiles[0][i].object = createObstacle();
  }

  for (let i = 1; i < tiles.length - 1; i++) {
    tiles[i][0].object = createObstacle();
    tiles[i][tiles[i].length - 1].object = createObstacle();
  }

  const lastRow = last(tiles);

  for (let i = 0; i < lastRow.length; i++) {
    lastRow[i].object = createObstacle();
  }
}
