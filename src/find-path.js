import { WALL } from './const.js';

function buildPath(node) {
  const path = [];

  while (node.previous) {
    path.unshift(node.position);
    node = node.previous;
  }

  return path;
}

const hash = (x, y) => `${x}-${y}`;

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

      if (nextY < 0 || nextY >= field.length) {
        continue;
      }

      if (nextX < 0 || nextX >= field[nextY].length) {
        continue;
      }

      const key = hash(nextX, nextY);

      if (checked.has(key)) {
        continue;
      }

      checked.set(key, true);

      if (field[nextY][nextX] === WALL) {
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

export const findPath = bfs;
