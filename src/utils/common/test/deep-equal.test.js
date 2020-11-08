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

  it('empty objects are equals', () => {
    isTrue(deepEqual({}, {}));
  });

  it('objects with different keys are not equal', () => {
    const box = { content: 'lamb' };
    const cup = { liquid: 'tea' };
    isFalse(deepEqual(box, cup));
  });

  it('object with same keys but different values are not equal', () => {
    isFalse(deepEqual({ liquid: 'beer' }, { liquid: 'coffee' }));
  });

  it('nested objects can be equal', () => {
    isTrue(deepEqual(
      { so: { deep: { deeper: { nesting: {} } } } },
      { so: { deep: { deeper: { nesting: {} } } } }
    ));
  });

  it('object with different number for keys are not equal', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 0, y: 0, z: 0 };

    isFalse(deepEqual(p1, p2));
  });

  it('mixed object-array structure can be equal', () => {
    isTrue(deepEqual(
      { list: [{ id: 1 }, { id: 2 }] },
      { list: [{ id: 1 }, { id: 2 }] }
    ));
  });

  it('mixed object-array structure might not be equal', () => {
    isFalse(deepEqual(
      { list: [{ id: 1 }, { id: 3 }] },
      { list: [{ id: 1 }, { id: 2 }] }
    ));

    isFalse(deepEqual(
      { list: [{ id: 1 }] },
      { list: [{ id: 1 }, { id: 2 }] }
    ));
  });

  it('object with different keys order should be equal', () => {
    const x = 1, y = 2;
    isTrue(deepEqual({ x, y }, { y, x }));
  });

  it('circle references', () => {

    const getLoop = () => {
      const a = {};
      const b = { a };
      a.b = b;
      return a;
    };

    isTrue(deepEqual(getLoop(), getLoop()));
  });

});
