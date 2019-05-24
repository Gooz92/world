import PriorityQueue from '../PriorityQueue.js';
import { equal, deepEqual } from '../assertion.js';

describe('PriorityQueue', function () {

  describe('#enqueue()', function () {

    it('increase size', () => {

      const q = new PriorityQueue();
      q.enqueue(1);
      equal(q.size, 1);
    });
  });

  describe('#enqueue()', function () {

    it('return min element', () => {
      const q = new PriorityQueue();

      q.enqueue('two', 2);
      q.enqueue('one', 1);
      q.enqueue('five', 5);
      q.enqueue('three', 3);

      equal(q.dequeue(), 'five');
    });
  });

  it('works', () => {
    const q = new PriorityQueue();
    const elements = [ 2, 8, 1, 9, 3, 7, 4, 5, 0, 6 ];

    elements.forEach(element => {
      q.enqueue(element, element);
    });

    const sorted = [];

    while (q.size > 0) {
      sorted.push(q.dequeue());
    }

    deepEqual(sorted, [ 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 ]);
  });

});
