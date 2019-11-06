export function normalizeArea(x1, y1, x2, y2) {
  return [
    Math.min(x1, x2), Math.min(y1, y2),
    Math.max(x1, x2), Math.max(y1, y2)
  ];
}
