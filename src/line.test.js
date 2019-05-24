import line from './line.js';
import { deepEqual } from 'utils/common/assertion.js';

describe('line', function () {

  it('generate one-point line', () => {
    const points = line(1, 1, 1, 1);
    deepEqual(points, [ [ 1, 1 ] ]);
  });

  it('generate horizontal line', () => {
    const points = line(1, 2, 3, 2);
    deepEqual(points, [
      [ 1, 2 ],
      [ 2, 2 ],
      [ 3, 2 ]
    ]);
  });

  it('generate vertical line', () => {
    const points = line(0, 1, 0, 3);
    deepEqual(points, [
      [ 0, 1 ],
      [ 0, 2 ],
      [ 0, 3 ]
    ]);
  });

  it('generate diagonal line', () => {
    const points = line(2, 1, 4, 3);
    deepEqual(points, [
      [ 2, 1 ],
      [ 3, 2 ],
      [ 4, 3 ]
    ]);
  });

});
