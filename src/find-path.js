import TILE_TYPES from './tile-types.js';

function buildPath(node) {
  const path = [];

  while (node.previous) {
    path.unshift(node.position);
    node = node.previous;
  }

  return path;
}

const hash = (x, y) => `${x}-${y}`;

const inBounds = (field, x, y) => (
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

function betterFindPath(field, x, y, predicate) {

  const visited = {
    [`${x}-${y}`]: 0
  };

  const nodes = [{
    position: [ x, y ],
    cost: 0
  }];

  const offsets = [
    [ 0, -1 ], [ -1, -1 ], [ -1, 0 ], [ 1, -1 ],
    [ 1, 0 ], [-1, 1], [ 0, 1 ], [ 1, 1 ],
  ];

  do {
    const currentNode = pickMin(nodes, node => node.cost);
    const [ currentX, currentY ] = currentNode.position;
    const currentKey = hash(...currentNode.position);

    if (predicate(...currentNode.position)) {
      return buildPath(currentNode);
    }

    for (let i = 0; i < offsets.length; i++) {
      const [ dx, dy ] = offsets[i];
      const nextPosition = [ currentX + dx, currentY + dy ];
      const [ nextX, nextY ] = nextPosition;

      if (!inBounds(field, nextX, nextY)) {
        continue;
      }

      const nextCost = visited[currentKey] + 2 + (i % 2);
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

function bfs(field, x, y, predicate) {
  const checked = new Map();

  const nodes = [{
    position: [ x, y ]
  }];

  const offsets = [
    [ 0, -1 ],
    [ -1, 0 ],
    [ 0, 1 ],
    [ 1, 0 ]
  ];
  
  do {
    const node = nodes.shift();
    const [ currentX, currentY ] = node.position;
    
    const nextPostions = ((currentX + currentY) % 2 ? offsets : [...offsets].reverse())
      .map(([ dx, dy ]) => [
        currentX + dx,
        currentY + dy
      ]);
    
    for (let i = 0; i < nextPostions.length; i++) {
      const [ nextX, nextY ] = nextPostions[i];

      if (!inBounds(field, nextX, nextY)) {
        continue;
      }

      const key = hash(nextX, nextY);

      if (checked.has(key)) {
        continue;
      }

      checked.set(key, true);

      if (field[nextY][nextX].type === TILE_TYPES.OBSTACLE) {
        continue;
      }

      nodes.push({
        position: [ nextX, nextY ],
        previous: node
      });

      if (predicate(nextX, nextY)) {
        return buildPath({ previous: node, position: [ nextX, nextY ]});
      }
    }
    
  } while (nodes.length > 0);

  return [];
}

export const findPath = betterFindPath;
