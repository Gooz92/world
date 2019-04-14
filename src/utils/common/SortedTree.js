import { swap, last } from './array.utils.js';

const getLeftIndex = i => i * 2 + 1;

const getRightIndex = i => i * 2 + 2;

export default class SortedTree {

  constructor() {
    this.items = [];
  }

  $get(index) {
    return this.items[index];
  }

  $sort(index = 0) {

    let indexOfMax = index;

    const leftIndex = getLeftIndex(index);
    const rightIndex = getRightIndex(index);

    if (leftIndex < this.size && this.$get(leftIndex) > this.$get(indexOfMax)) {
      indexOfMax = leftIndex;
    }

    if (rightIndex < this.size && this.$get(rightIndex) > this.$get(indexOfMax)) {
      indexOfMax = rightIndex;
    }

    if (indexOfMax !== index) {
      swap(this.items, index, indexOfMax);
      this.$sort(indexOfMax);
    }

  }

  push(item) {

    let index = this.items.push(item) - 1;
    let parentIndex = Math.floor(index / 2);

    while (index > 0 && this.$get(parentIndex) < this.$get(index)) {
      swap(this.items, index, parentIndex);
      index = parentIndex;
      parentIndex = Math.floor(index / 2);
    }
  }

  pop() {
    const max = this.$get(0);
    const last = this.items.pop();

    if (this.size > 0) {
      this.items[0] = last;
      this.$sort();
    }

    return max;
  }

  get size() {
    return this.items.length;
  }
}
