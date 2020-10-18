import { sum, getIndex } from 'utils/common/math.utils.js';
import { generateArray } from './common/array.utils.js';
import { getZero } from './common/fn.utils.js';
import { randomGenerator } from './common/random.utils.js';

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

/**
 * .     .
 *  \   /
 *    x
 *  /   \
 * .     .
 *
 * side = pow(2, n)
 */

export function diamond(arr, width, height, side, next) {

  const half = side / 2;

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

      arr[index] = next(neighbors, side * Math.SQRT2);
    }
  }
}

/**
 *
 *     .
 *     |
 * . - + - .
 *     |
 *     .
 */

export function square(arr, width, height, side, next) {
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

const defaults = {
  rows: 1,
  cols: 1,
  cellSize: 256
};

export default function diamondSquareGenerator() {

  return {

    build() {

      return new DiamondSquareGenerator(
        this.rows || defaults.rows,
        this.cols || defaults.cols,
        this.cellSize || defaults.cellSize
      );
    },

    setRows(rows) {
      this.rows = rows;
      return this;
    },

    setCols(cols) {
      this.cols = cols;
      return this;
    },

    setCellSize(cellSize) {
      this.cellSize = cellSize;
      return this;
    }
  };
}

class DiamondSquareGenerator {

  constructor(rowCount, colCount, cellSize) {
    Object.assign(this, {
      rowCount, colCount, cellSize
    });

    this.size = this.$calculateSize();
  }

  $generateStartPoints() {
    const points = [];

    for (let i = 0; i < this.rowCount; i++) {
      const y = i * this.cellSize;
      for (let j = 0; j < this.colCount; j++) {
        const x = j * this.cellSize;
        points.push([ x, y ]);
      }
    }

    return points;
  }

  generate(roughness, seed = 42) {
    const random = randomGenerator(seed);

    const next = (neighbors, distance) => {
      const bound = roughness * distance;
      return sum(neighbors) / 4 + random.nextInt(-bound, bound);
    };

    const { width, height } = this.size;

    const map = generateArray(width * height, getZero);
    const startPoints = this.$generateStartPoints();

    startPoints.forEach(([ x, y ]) => {
      const index = getIndex(x, y, width, height);
      map[index] = random.nextInt(0, 300);
    });

    let chunkSize = this.cellSize;

    while (chunkSize > 1) {
      diamond(map, width, height, chunkSize, next);
      square(map, width, height, chunkSize, next);
      chunkSize = Math.ceil(chunkSize / 2);
    }

    return map;
  }

  $calculateSide(lineCount) {
    return this.cellSize * (lineCount + 1);
  }

  $calculateSize() {
    return {
      width: this.$calculateSide(this.colCount),
      height: this.$calculateSide(this.rowCount)
    };
  }
}
