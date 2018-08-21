function buildPath(node) {
  const path = [];

  while (node.previous) {
    path.unshift(node.position);
    node = node.previous;
  }

  return path;
}

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

let offsets = [
  [ -1, -1 ], [ 0, -1 ], [ 1, -1 ], [ -1, 0 ],
  [ 1, 0 ], [ -1, 1], [ 0, 1 ], [ 1, 1 ]
];

const getTrue = () => true;

export default function findPath(field, x, y, isFound, isPassable = getTrue) {

  const $isPassable = (x, y, field) => (
    inBounds(x, y, field) && isPassable(x, y, field)
  );

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
    const currentKey = hash(...currentNode.position);

    if (isFound(currentX, currentY, field)) {
      return buildPath(currentNode);
    }

    for (let i = 0; i < offsets.length; i++) {
      const [ dx, dy ] = offsets[i];
      const nextPosition = [ currentX + dx, currentY + dy ];
      const [ nextX, nextY ] = nextPosition;

      if (!$isPassable(nextX, nextY, field)) {
        continue;
      }

      const isDiagonal = Math.abs(dx) > 0 && Math.abs(dy) > 0;

      if (isDiagonal && 
        !$isPassable(currentX, currentY + dy, field) &&
        !$isPassable(currentX + dx, currentY, field)) {
        continue;
      }

      const nextCost = visited[currentKey] + (isDiagonal ? 3 : 2);
      const key = hash(...nextPosition);

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

  return [];
}
