export default function line(x1, y1, x2, y2) {
  const points = [];

  const y0 = y2 - y1;

  const dx = Math.abs(x1 - x2);
  const dy = Math.abs(y0);

  const diy = Math.sign(y0);

  let y = y1;
  let e = 0;

  for (let x = x1; x <= x2; x++) {
    points.push([x, y]);
    e += dy;

    if (2 * e >= dx) {
      y += diy;
      e -= dx;
    }
  }

  return points;
}
