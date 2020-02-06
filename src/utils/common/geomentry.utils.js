const DEFAULT_DIRECTION = { dx: 0, dy: 0 };

const round = (n, f) => f ? Math.ceil(n) : Math.floor(n);

// TODO: is it needed ?
export function getCenter(x, y, width, height, direction = DEFAULT_DIRECTION) {
  const xc = (x + width) / 2 - 0.5, yc = (y + height) / 2 - 0.5;

  const { dx, dy } = direction;

  return [
    round(xc, dx > 0),
    round(yc, dy > 0)
  ];
}
