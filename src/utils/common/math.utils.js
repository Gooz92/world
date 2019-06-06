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

export function inCycleRange(value, left, right, maxBound = right) {
  if (value < 0 || value >= maxBound) {
    return false;
  }

  const gteLeft = value >= left;
  const ltRight = value < right;

  return (left < right) ? (gteLeft && ltRight) : (gteLeft || ltRight);
}
