import SortedTree from '../SortedTree.js';
import { assert } from 'chai';

describe('SortedTree', function () {

  describe('#push()', function () {

    it('increase size', () => {

      const st = new SortedTree();
      st.push(1);
      assert.strictEqual(st.size, 1);
    });
  });

  describe('#pop()', function () {

    it('return min element', () => {
      const st = new SortedTree();

      st.push(2);
      st.push(1);
      st.push(5);
      st.push(3);

      assert.strictEqual(st.pop(), 5);
    });
  });

  it('works', () => {
    const st = new SortedTree();
    const elements = [ 2, 8, 1, 9, 3, 7, 4, 5, 0, 6 ];

    elements.forEach(element => {
      st.push(element);
    });

    const sorted = [];

    while (st.size > 0) {
      sorted.push(st.pop());
    }

    assert.deepEqual(sorted, [ 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 ]);
  });

});
