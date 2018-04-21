import { WALL } from './const.js';

function buildPath(node) {
  const path = [];

  while (node.previous) {
    path.unshift(node.position);
    node = node.previous;
  }

  return path;
}

export function findPath(field, x, y, predicate) {
  const checked = new Map();

  const nodes = [{
    position: [ x, y ]
  }];
  
  do {
    const node = nodes.shift();
    const [ currentX, currentY ] = node.position;
    
    const nextPostions = [
      [ currentX, currentY - 1 ],
      [ currentX, currentY + 1 ],
      [ currentX - 1, currentY ],
      [ currentX + 1, currentY ]
    ];

    for (let i = 0; i < nextPostions.length; i++) {
      const [ nextX, nextY ] = nextPostions[i];

      if (nextY < 0 || nextY >= field.length) {
        continue;
      }

      if (nextX < 0 || nextX >= field[nextY].length) {
        continue;
      }

      if (checked.has(nextX + '-' + nextY)) {
        continue;
      }

      if (predicate(nextX, nextY)) {
        return buildPath(node);
      }

      checked.set(nextX + '-' + nextY, true);

      if (field[nextY][nextX] === WALL) {
        continue;
      }

      nodes.push({
        position: [ nextX, nextY ],
        previous: node
      });
    }
    
  } while (nodes.length > 0);

  return [];
}