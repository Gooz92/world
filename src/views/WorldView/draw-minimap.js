import { createElement } from 'utils/dom.utils.js';

const green = [ 0, 255, 0 ];
const gray = [ 127, 127, 127 ];
const red = [ 255, 0, 0, ];
const white = [ 255, 255, 255 ];

const colors = [
  white,
  gray,
  green,
  red
];

export default function draw(tiles) {
  const width = tiles[0].length;
  const height = tiles.length;

  const canvas = createElement('canvas', { width, height });

  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, width, height);

  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[y].length; x++) {
      const i = (y * width + x) * 4;
      const object = tiles[y][x].object || {};
      const colorIndex = object.type || 0;
      const color = colors[colorIndex];

      imageData.data[i] = color[0];
      imageData.data[i + 1] = color[1];
      imageData.data[i + 2] = color[2];
      imageData.data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return canvas;
}
