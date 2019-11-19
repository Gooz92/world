export default function (x1, y1, x2, y2) {
  const dx = Math.abs(x1 - x2);
  const dy = Math.abs(y1 - y2);

  return (
    3 * Math.min(dx, dy) +
    2 * Math.abs(dx - dy)
  );
}
