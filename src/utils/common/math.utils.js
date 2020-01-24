export function normalize(arr, upperBound) {
  const min = findMin(arr), max = findMax(arr);

  const d = Math.abs(max - min);

  return arr.map(item => Math.round((item - min) / d * upperBound));
}

export function findMin(arr) {
  let m = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < m) m = arr[i];
  }

  return m;
}

export function findMax(arr) {
  let m = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > m) m = arr[i];
  }

  return m;
}

export function sum(array) {
  return array.reduce((sum, a) => sum + a, 0);
}

export function getCycleCoordinate(actualCoordinate, bound) {
  const coordinate = actualCoordinate % bound;

  if (coordinate < 0) {
    return bound + coordinate;
  }

  return coordinate;
}

// get index by 2d-coordinates
export function getIndex(x, y, width, height) {
  const x0 = getCycleCoordinate(x, width);
  const y0 = getCycleCoordinate(y, height);

  return y0 * width + x0;
}

/**
 * a b c
 * d e f
 *
 * d a
 * e b
 * f c
 */

export function rotateFlatMatrix(matrix, width, height) {
  const rotated = [];

  for (let j = 0; j < width; j++) {
    for (let i = height - 1; i >= 0; i--) {
      const index = i * width + j;
      rotated.push(matrix[index]);
    }
  }

  return rotated;
}
