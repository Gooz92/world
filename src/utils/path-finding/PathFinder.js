import { noop, getTrue, getFalse } from 'utils/common/fn.utils.js';
import { postProcess } from './path-finding.utils.js';
import { getCycleCoordinate } from 'utils/common/math.utils.js';
import PriorityQueue from 'utils/common/PriorityQueue.js';
import Direction from 'model/Direction.enum.js';

const hash = (x, y) => `${x}-${y}`;

export default class PathFinder {

  constructor(options) {

    Object.assign(this, {
      onAxialTile: noop,
      onDiagonalTile: noop,
      isTilePassable: getTrue,
      isTileFound: getFalse,
      createQueue: () => new PriorityQueue((a, b) => a < b)
    }, options);

    this.isFound = false;
    this.goal = null;
  }

  onTile(tile, x, y, isDiagonal, cost) {
    if (isDiagonal) {
      this.onDiagonalTile(tile, x, y, cost);
    } else {
      this.onAxialTile(tile, x, y, cost);
    }

    if (this.isTileFound(tile, x, y)) {
      this.found(tile);
    }
  }

  found(goal) {
    this.goal = goal;
    this.isFound = true;
  }

  getResult(node, tiles) {
    const goal = this.goal;

    this.goal = null;
    this.isFound = false;

    const isTilePassable = (x, y) => {
      const tile = tiles[y][x];
      return this.isTilePassable(tile);
    };

    return {
      goal: goal,
      path: postProcess(node, isTilePassable, tiles[0].length, tiles.length)
    };
  }

  find(tiles, x, y) {
    const visited = {
      [hash(x, y)]: 0
    };

    const queue = this.createQueue();

    queue.enqueue({ position: [ x, y ] }, 0);

    do {

      const currentNode = queue.dequeue();
      const { position: [ currentX, currentY ] } = currentNode;
      const currentKey = hash(currentX, currentY);

      for (let i = 0; i < Direction.members.length; i++) {

        const direction = Direction.members[i];

        const { dx, dy } = direction;

        const nextX = getCycleCoordinate(currentX + dx, tiles[0].length);
        const nextY = getCycleCoordinate(currentY + dy, tiles.length);

        const tile = tiles[nextY][nextX];

        const nextCost = visited[currentKey] + direction.distance;

        this.onTile(tile, nextX, nextY, direction.isDiagonal, nextCost);

        if (this.isFound) {
          return this.getResult(currentNode, tiles);
        }

        if (!this.isTilePassable(tile)) {
          continue;
        }

        const key = hash(nextX, nextY);

        if (!visited[key] || nextCost < visited[key]) {
          visited[key] = nextCost;
          queue.enqueue({
            position: [ nextX, nextY ],
            previous: currentNode,
            direction
          }, nextCost);
        }
      }
    } while (!queue.isEmpty);

    return { path: [] };
  }
}
