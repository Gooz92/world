import { findMin, findMax } from './math.utils.js';
import { generateArray } from './array.utils.js';
import { getZero } from './fn.utils.js';

export default function getFrequencyTable(data, segments) {

  const min = findMin(data), max = findMax(data);
  const d = Math.abs(max - min);
  const step = d / segments;

  const table = generateArray(segments, getZero);

  data.forEach(n => {
    let index = 0;

    while (n > (index + 1) * step) {
      ++index;
    }

    ++table[index];
  });

  return table;
}
