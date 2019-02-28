import generate from 'utils/diamond-square.js';
import { createElement } from 'utils/dom.utils.js';
import { normalize } from 'utils/math.utils.js';

const side = 256;

const canvas = createElement('canvas', {
  width: side,
  height: side
});

const context = canvas.getContext('2d');

const image = context.getImageData(0, 0, side, side);

const map = normalize(generate(7), 100);

map.forEach((item, index) => {
  const startIndex = index * 4;
  const b = item > 60 ? 0 : 255;

  image.data[startIndex] = b;
  image.data[startIndex + 1] = b;
  image.data[startIndex + 2] = b;
  image.data[startIndex + 3] = 255;
});

context.putImageData(image, 0, 0);

document.body.appendChild(canvas);
