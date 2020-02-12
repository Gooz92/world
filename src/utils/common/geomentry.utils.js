// get middle of discrete segment
export const getMiddle = (start, length) => Math.ceil(start + length / 2 - 1);

export function getCenter(x, y, width, height) {
  return [
    getMiddle(x, width),
    getMiddle(y, height)
  ];
}
