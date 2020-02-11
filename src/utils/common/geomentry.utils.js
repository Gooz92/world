export function getCenter(x, y, width, height) {
  return [
    Math.floor((x + width) / 2),
    Math.floor((y + height) / 2)
  ];
}
