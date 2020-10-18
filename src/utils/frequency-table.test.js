import getFrequencyTable from './frequency-table.js';
import { generateArray } from 'utils/common/array.utils.js';
import { equal } from './assertion.js';
import { getNull } from './common/fn.utils.js';

describe('getFrequencyTable()', function () {

  it('return array with specified length', () => {
    const data = generateArray(20, getNull);
    const length = 3;
    const frequencies = getFrequencyTable(data, length);
    equal(frequencies.length, length);
  });

  it('can return normal distribution (every col == CONST)', () => {
    const n = 42;
    const m = 7;

    const data = generateArray(n * m, index => index % m);
    const frequencies = getFrequencyTable(data, m);

    frequencies.every(f => equal(f, n));
  });

});
