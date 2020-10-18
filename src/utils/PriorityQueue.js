import { swap } from './common/array.utils.js';

export default class PriorityQueue {

  constructor(compare = (a, b) => a > b) {
    this.$nodes = [];

    /*
     * if compare return true first argument have highest priority
     * (will dequeued before second argument)
     */

    this.$compare = compare;
  }

  $compareByIndexes(i, j) {
    const a = this.$get(i).priority;
    const b = this.$get(j).priority;

    return this.$compare(a, b);
  }

  $get(index) {
    return this.$nodes[index];
  }

  $sort(index = 0) {

    let indexOfMax = index;

    const leftIndex = index * 2 + 1;
    const rightIndex = leftIndex + 1;

    if (leftIndex < this.size && this.$compareByIndexes(leftIndex, indexOfMax)) {
      indexOfMax = leftIndex;
    }

    if (rightIndex < this.size && this.$compareByIndexes(rightIndex, indexOfMax)) {
      indexOfMax = rightIndex;
    }

    if (indexOfMax !== index) {
      swap(this.$nodes, index, indexOfMax);
      this.$sort(indexOfMax); // try to get rid of recursion
    }

  }

  enqueue(node, priority) {

    const $node = {
      data: node,
      priority
    };

    let index = this.$nodes.push($node) - 1;
    let parentIndex = Math.floor(index / 2);

    while (index > 0 && this.$compareByIndexes(index, parentIndex)) {
      swap(this.$nodes, index, parentIndex);
      index = parentIndex;
      parentIndex = Math.floor(index / 2);
    }
  }

  dequeue() {
    const max = this.$get(0).data;
    const last = this.$nodes.pop();

    if (this.size > 0) {
      this.$nodes[0] = last;
      this.$sort();
    }

    return max;
  }

  get isEmpty() {
    return this.size === 0;
  }

  get size() {
    return this.$nodes.length;
  }
}
