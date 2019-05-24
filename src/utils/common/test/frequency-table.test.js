import getFrequencyTable from '../frequency-table.js';
import { generateArray } from 'utils/common/array.utils.js';
import { equal } from '../assertion.js';

describe('getFrequencyTable()', function () {

  it('return array with specified length', () => {
    const data = generateArray(20);
    const length = 3;
    const frequencies = getFrequencyTable(data, length);
    equal(frequencies.length, length);
  });

});
