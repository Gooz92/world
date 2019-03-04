import generate from 'utils/diamond-square.js';
import { normalize } from 'utils/math.utils.js';
import createCanvas from './views/canvas.js';
import createForm from './views/form.js';

const side = 512;

const canvas = createCanvas(side);

const seed = 42, roughness = 0.5;

const form = createForm(
  [
    { id: 'seed', value: seed, parse: value => +value },
    { id: 'roughness', value: roughness, parse: value => +value }
  ],

  ({ seed, roughness }) => {
    draw(roughness, seed);
  }
);

function draw(roughness, seed) {
  const map = normalize(generate(8, roughness, seed), 255);
  canvas.update(map);
}

draw(roughness, seed);

document.body.appendChild(canvas.element);
document.body.appendChild(form.element);
