import PathFinder from './PathFinder.js';

import { generateArray } from 'utils/common/array.utils.js';
import { getZero } from 'utils/common/fn.utils.js';
import PriorityQueue from 'utils/common/PriorityQueue.js';

// Naive implementations for testing purpose
class SimplePriorityQueue {

  constructor() {
    this.$nodes = [];
  }

  enqueue(node, priority) {
    this.$nodes.push({ data: node, priority });
  }

  dequeue() {
    let { priority } = this.$nodes[0];
    let index = 0;

    for (let i = 0; i < this.size; i++) {
      const nextPriority = this.$nodes[i].priority;

      if (nextPriority < priority) {
        priority = nextPriority;
        index = i;
      }
    }

    return this.$nodes.splice(index, 1)[0].data;
  }

  get size() {
    return this.$nodes.length;
  }

  get isEmpty() {
    return this.size === 0;
  }
}


/*
 * === x 2 ===
 *
 *           .
 * 0 1 2 3 4 5 6 7
 * . . . . . . . . 0
 * . . . . . . . . 1
 * . . s . . . . . 2
 * . . . . . . . . 3
 * . . . . . e . . 4 .
 * . . . . . . . . 5
 * . . . . . . . . 6
 */

const tiles = generateArray(448, generateArray(512, getZero));

tiles[128][128] = 'start';
tiles[256][320] = 'end';

const isFound = tile => tile === 'end';

const pf1 = new PathFinder({
  onAxialTile: function (tile) { return isFound(tile) && this.found(tile); },
  onDiagonalTile: function (tile) { return isFound(tile) && this.found(tile); },
  createQueue: () => new SimplePriorityQueue((a, b) => a < b)
});

const pf2 = new PathFinder({
  onAxialTile: function (tile) { return isFound(tile) && this.found(tile); },
  onDiagonalTile: function (tile) { return isFound(tile) && this.found(tile); }
});

console.time('pf1');
pf1.find(tiles, 32, 32);
console.timeEnd('pf1');

console.time('pf2');
pf2.find(tiles, 32, 32);
console.timeEnd('pf2');
