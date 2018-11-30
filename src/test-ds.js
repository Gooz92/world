import generate from 'utils/diamond-square.js';
import { createElement } from 'utils/dom.utils.js';
import { desirialize } from 'utils/query-params.utils.js';

const side = 513;

const canvas = createElement('canvas', {
  width: side,
  height: side
});

const context = canvas.getContext('2d');

const image = context.getImageData(0, 0, side, side);

window.onhashchange = function () {
  const query = location.hash.substr(1);

  const params = desirialize(query, { seed: parseInt });

  const map = generate(params.seed || 42);

  map.forEach((item, index) => {
    const startIndex = index * 4;

    image.data[startIndex] = item;
    image.data[startIndex + 1] = item;
    image.data[startIndex + 2] = item;
    image.data[startIndex + 3] = 255;
  });

  context.putImageData(image, 0, 0);
};

document.getElementById('viewport')
  .appendChild(canvas);
