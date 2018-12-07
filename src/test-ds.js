import generate from 'utils/diamond-square.js';
import { createElement } from 'utils/dom.utils.js';
import { normalize } from 'utils/math.utils.js';
import { getSeed } from 'utils/random.utils';

const side = 513;

const canvas = createElement('canvas', {
  width: side,
  height: side
});

const context = canvas.getContext('2d');

const image = context.getImageData(0, 0, side, side);

const config = {
  seed: {
    parse: value => parseInt(value, 16),
    default: getSeed().toString(16)
  }
};

window.onload = function () {
  const paramsString = location.hash.substr(1);

  if (paramsString.length === 0) {
    location.hash = 'seed:42';
  }
};

window.onhashchange = function () {
  const query = location.hash.substr(1);

  const map = normalize(generate(9, 42), 255);

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
