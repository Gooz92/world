import h from './calculate-distance.js';
import { backtracePath } from './path-finding.utils.js';
import Direction from 'model/Direction.enum.js';
import { remove } from 'utils/common/array.utils.js';
import calculateDistance from './calculate-distance.js';

function findMin(nodes) {
  let min = nodes[0];

  for (let i = 1; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.fScore < min.fScore) {
      min = node;
    }
  }

  return min;
}

const hash = node => node.position.join(',');

export default function find(x1, y1, x2, y2, tiles) {

  let node = {
    position: [ x1, y1 ],
    gScore: 0,
    fScore: calculateDistance(x1, x1, y2, x2)
  };

  const gScores = new Map();

  const openSet = new Map();

  openSet.set(hash(node), node);

  while (openSet.entries().length > 0) {
    const currentNode = findMin(openSet.entries());
    const [ x, y ] = currentNode.position;

    if (x === x2 && y == y2) {
      return backtracePath(currentNode);
    }

    openSet.delete(hash(currentNode));

    for (let i = 0; i < Direction.members.length; i++) {
      const direction = Direction.members[i];
      const gScore = currentNode.gScore + direction.distance;
      const [ nextX, nextY ] = [
        node.position[0] + direction.dx,
        node.position[1] + direction.dy
      ];
      const nHash = [ nextX, nextY ].join(',');
      if (gScores.has(hash) && gScore < gScores.get(hash)) {
        gScores.set(hash, gScore);
        if (!openSet.has(nHash)) {
    
          currentNode.fScore = gScore + h(x1, y1, nextX, nextY);
        }
      }
    }
  }
}
