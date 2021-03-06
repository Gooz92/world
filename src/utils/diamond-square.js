import { getCycleCoordinate, sum, normalize } from 'utils/math.utils.js';
import { generateArray, rollUp } from './array.utils.js';
import { getZero } from './fn.utils.js';
import { random } from './random.utils.js';

function getIndex(x, y, w, h) {
  const x0 = getCycleCoordinate(x, w);
  const y0 = getCycleCoordinate(y, h);

  return y0 * w + x0;
}

const getSide = n => Math.pow(2, n) + 1;

function diamond(arr, width, height, side, next) {

  const step = side - 1;
  const half = Math.floor(step / 2);

  for (let y0 = half; y0 < height - half; y0 += step) {
    for (let x0 = half; x0 < width - half; x0 += step) {
      const index = getIndex(x0, y0, width, height);

      const neighbors = [
        [ x0 - half, y0 - half ],
        [ x0 + half, y0 - half ],
        [ x0 - half, y0 + half ],
        [ x0 + half, y0 + half ]
      ].map(([ x, y ]) => {
        const i = getIndex(x, y, width, height);
        return arr[i];
      });

      arr[index] = next(neighbors, side * 1.5, 10);
    }
  }
}

function square(arr, width, height, side, next) {

  const step = (side - 1) / 2;

  for (let y0 = 0; y0 < height; y0 += step) {
    for (let x0 = ((y0 / step + 1) % 2) * step; x0 < width; x0 += side - 1) {
      const index = getIndex(x0, y0, width, height);

      const neighbors = [
        [ x0, y0 - step ],
        [ x0 + step, y0 ],
        [ x0, y0 + step ],
        [ x0 - step, y0 ]
      ].map(([ x, y ]) => {
        const i = getIndex(x, y, width, height);
        return arr[i];
      });

      arr[index] = next(neighbors, side, 10);
    }
  }
}

export default function generate(n, seed = 42) {

  const nextRnd = random(seed);

  const randomInt = (min, max) => (
    Math.floor((min + (max - min + 1) * nextRnd()))
  );

  const next = (neighbors, distance, roughness) => {
    const bound = roughness * distance;
    return sum(neighbors) / 4 + randomInt(-bound, bound);
  };

  const side = getSide(n);
  const length = side * side;

  const map = generateArray(length, getZero);

  const corners = [
    0, side - 1,
    length - side, length - 1
  ];

  corners.forEach(index => {
    map[index] = randomInt(0, 100); // ?
  });

  let chunkSize = side;

  while (chunkSize > 2) {
    diamond(map, side, side, chunkSize, next);
    square(map, side, side, chunkSize, next);
    chunkSize = Math.ceil(chunkSize / 2);
  }

  return map;
}
