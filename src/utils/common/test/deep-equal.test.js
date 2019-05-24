import deepEqual from '../deep-equal.js';
import { isTrue, isFalse } from '../assertion.js';

describe('deepEqual', function () {

  it('return true for equal primitives', () => {
    isTrue(deepEqual(42, 42));
    isTrue(deepEqual('same', 'same'));
  });

  it('return false for not equal primitives', () => {
    isFalse(deepEqual(2 + 2, 5));
    isFalse(deepEqual(false, true));
  });

  it('return true for equal references', () => {
    const same = {};
    const thing = same;

    isTrue(deepEqual(same, thing));
  });

  it('null should be equal to null', () => {
    isTrue(deepEqual(null, null));
  });

  it('flat arrays with same elements should be equal', () => {
    const pair = [ 'w', 'b' ];
    const colors = [ 'w', 'b' ];

    isTrue(deepEqual(pair, colors));
  });

  it('flat arrays with different elements should not be equal', () => {
    const colors = [ 'w', 'b' ];
    const dualism = [ 'yin', 'yang' ];

    isFalse(deepEqual(colors, dualism));
  });

  it('flat arrays with different lenght should not be equal', () => {
    const longTail = [ '~', '~', '~', '.' ];
    const shortTail = [ '~', '~', '.' ];

    isFalse(deepEqual(longTail, shortTail));
  });

  it('empty arrays are equals', () => {
    isTrue(deepEqual([], []));
  });

  it('nested arrays should be equal', () => {
    const a = [ 1, [ 2, 3 ], 'a', [ false, null ], [ true ], [] ];
    const b = [ 1, [ 2, 3 ], 'a', [ false, null ], [ true ], [] ];
    isTrue(deepEqual(a, b));
  });

});
