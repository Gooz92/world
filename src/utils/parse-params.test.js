import { deepEqual } from './common/assertion.js';

describe('parseParams', function () {
  it('works', () => {
    const params = 'x:1;y:2';
    const config = {
      x: value => +value,
      y: value => +value
    };

    const parsed = parseParams(params, config);

    deepEqual(parsed, { x: 1, y : 2 })
  });
});