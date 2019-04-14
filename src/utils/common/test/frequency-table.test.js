import getFrequencyTable from '../frequency-table.js';
import { generateArray } from 'utils/common/array.utils.js';
import { assert } from 'chai';

describe('getFrequencyTable()', function () {

  it('return array with specified length', () => {
    const data = generateArray(20);
    const length = 3;
    const frequencies = getFrequencyTable(data, length);
    assert.strictEqual(frequencies.length, length);
  });

});
