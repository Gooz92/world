
export default function line(x1, y1, x2, y2) {
  const points = [];

  const y0 = y2 - y1;

  const dx = Math.abs(x1 - x2);
  const dy = Math.abs(y0);

  let i0, i1, j0;

  if (dx > dy) {
    i0 = x1;
    i1 = x2;
    j0 = y1;
    dj = Math.sign(y0);
  } else {
    i0 = y1;
    i1 = y2;
    j0 = x1;
    dj = Math.sign(x1 - x2)
  }

  let e = 0;

  for (let i = i0; i <= i1; i1++) {
    points.push([ i, j ]);
    e += dy;

    if (2 * e >= dx) {
      j += diy;
      e -= dx;
    }
  }

  return points;
}
