export function getCycleCoordinate(actualCoordinate, bound) {
  const coordinate = actualCoordinate % bound;

  if (coordinate < 0) {
    return bound + coordinate;
  }

  return coordinate;
}

export function inCycleRange(value, left, right, maxBound = right) {
  if (value < 0 || value >= maxBound) {
    return false;
  }

  const gteLeft = value >= left;
  const ltRight = value < right;

  return (left < right) ? (gteLeft && ltRight) : (gteLeft || ltRight);
}
