import { getCycleCoordinate, sum, normalize } from 'utils/common/math.utils.js';
import { generateArray } from './array.utils.js';
import { getZero } from './fn.utils.js';
import { randomGenerator } from './random.utils.js';


/**
 * Input params
 *
 *  width in regions
 *  height in regions
 *
 *  region size
 *
 * roughness
 */

function getIndex(x, y, w, h) {
  const x0 = getCycleCoordinate(x, w);
  const y0 = getCycleCoordinate(y, h);

  return y0 * w + x0;
}

export const getSide = (regions, regionSize) => regionSize * (regions + 1);

function diamond(arr, width, height, side, next) {

  const half = Math.floor(side / 2);

  for (let y0 = half; y0 < height; y0 += side) {
    for (let x0 = half; x0 < width; x0 += side) {
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

      arr[index] = next(neighbors, side * 1.5);
    }
  }
}

function square(arr, width, height, side, next) {
  const step = side / 2;

  for (let y0 = 0; y0 < height; y0 += step) {
    for (let x0 = ((y0 / step + 1) % 2) * step; x0 < width; x0 += side) {
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

      arr[index] = next(neighbors, side);
    }
  }
}

export function generateStartPoints(hr, vr, rs) {

  const points = [];

  for (let i = 0; i < vr; i++) {
    for (let j = 0; j < hr; j++) {
      points.push([ j * rs, i * rs ]);
    }
  }

  return points;
}

export function generate(hr, vr, rs, roughness, seed = 12) {

  const random = randomGenerator(seed);

  const next = (neighbors, distance) => {
    const bound = roughness * distance;
    return sum(neighbors) / 4 + random.nextInt(-bound, bound);
  };

  const width = getSide(hr, rs);
  const height = getSide(vr, rs);

  const map = generateArray(width * height, getZero);
  const startPoints = generateStartPoints(hr, vr, rs);

  startPoints.forEach(([ x, y ]) => {
    const index = getIndex(x, y, width, height);
    map[index] = random.nextInt(0, 300);
  });

  let chunkSize = rs;

  while (chunkSize > 1) {
    diamond(map, width, height, chunkSize, next);
    square(map, width, height, chunkSize, next);
    chunkSize = Math.ceil(chunkSize / 2);
  }

  return map;
}
