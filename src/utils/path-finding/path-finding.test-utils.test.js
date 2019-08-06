import buildLinkedList from './path-finding.test-utils.js';
import { equal } from 'utils/common/assertion.js';

describe('buildLinkedList', function () {
  it ('works', () => {
    const array = [ 'a', 'b', 'c' ];
    const node = buildLinkedList(array);

    equal(node.data, 'c');
    equal(node.previous.data, 'b'),
    equal(node.previous.next, node);
    equal(node.previous.previous.data, 'a');
  });
});
