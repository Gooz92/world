import Direction from 'model/Direction.enum.js';

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

export function buildPath(positions, startDirection) {
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
