import { buildLinkedList, isContinuous } from './path-finding.test-utils.js';
import { equal, isTrue, isFalse } from 'utils/common/assertion.js';

describe('buildLinkedList', function () {
  it ('works', () => {
    const array = [ 'a', 'b', 'c' ];
    const node = buildLinkedList(array);

    equal(node.data, 'c');
    equal(node.previous.data, 'b'),
    equal(node.previous.previous.data, 'a');
  });
});

describe('isContinuous', function () {
  it('return true if distances between each position less than 2', () => {
    const path = [ [ 1, 1 ], [ 2, 2 ], [ 2, 3 ], [ 1, 4 ] ];
    isTrue(isContinuous(path));
  });

  it('return false is there are hole in path', () => {
    const path = [ [ 2, 4 ], [ 3, 5 ], [ 3, 3 ] ];
    isFalse(isContinuous(path));
  });
});
