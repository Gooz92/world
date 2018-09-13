import calculateDistance from '../calculate-distance.js';
import { generateArray } from '../utils/array.utils.js';
import createField from '../create-field.js';

export default function () {

  const tiles = generateArray(61, () => (
    generateArray(61, () => 0)
  ));

  const { table } = createField(tiles, (tile, x, y) => {
    const distance = calculateDistance(30, 30, x, y) / 2;

    return {
      style: {
        backgroundColor: distance < 30 ? 'black' : 'white'
      }
    };
  });

  document.body.appendChild(table);
}
