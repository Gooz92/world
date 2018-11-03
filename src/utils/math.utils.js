export function getCycleCoordinate(actualCoordinate, bound) {
  const coordinate = actualCoordinate % bound;

  if (coordinate < 0) {
    return bound + coordinate;
  }

  return coordinate;
}
