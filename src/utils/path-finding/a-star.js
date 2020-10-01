import h from './calculate-distance.js';
import { backtracePath } from './path-finding.utils.js';
import Direction from 'model/Direction.enum.js';
import calculateDistance from './calculate-distance.js';

const hash = node => node.position.join(',');

function findMin(nodes, fScores) {
  let minNode = nodes[0];
  let minH = fScores.get(hash(minNode));

  for (let i = 1; i < nodes.length; i++) {
    const node = nodes[i];
    const m = fScores.get(hash(node));
    if (m < minH) {
      minNode = node;
      minH = m;
    }
  }

  return minNode;
}

export default function find(isTilePassable, x1, y1, x2, y2) {

  let node = {
    position: [ x1, y1 ]
  };

  const gScores = new Map();
  const fScores = new Map();
  const openSet = new Map();

  fScores.set(hash(node), calculateDistance(x1, y1, x2, y2));
  gScores.set(hash(node), 0);
  openSet.set(hash(node), node);

  while (openSet.size > 0) {
    const currentNode = findMin(Array.from(openSet.values()), fScores);
    const [ x, y ] = currentNode.position;

    if (x === x2 && y === y2) {
      return backtracePath(currentNode);
    }

    const cHash = hash(currentNode);
    openSet.delete(cHash);

    for (let i = 0; i < Direction.members.length; i++) {
      const direction = Direction.members[i];
      const gScore = gScores.get(cHash) + direction.distance;

      const [ nextX, nextY ] = [
        currentNode.position[0] + direction.dx,
        currentNode.position[1] + direction.dy
      ];

      if (!isTilePassable(nextX, nextY)) {
        continue;
      }

      const nHash = [ nextX, nextY ].join(',');
      if (!gScores.has(nHash) || gScore < gScores.get(nHash)) {
        gScores.set(nHash, gScore);
        fScores.set(nHash, gScore + h(nextX, nextY, x2, y2));

        if (!openSet.has(nHash)) {
          const nextNode = {
            position: [ nextX, nextY ],
            previous: currentNode,
            direction
          };
          openSet.set(nHash, nextNode);
        } else {
          const nextNode = openSet.get(nHash);
          nextNode.previous = currentNode;
        }
      }
    }
  }
}
