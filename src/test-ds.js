import { generate, getSide } from 'utils/diamond-square.js';
import { normalize } from 'utils/math.utils.js';
import createCanvas from './views/canvas.js';
import createForm from './views/form.js';
import getFrequencyTable from 'utils/frequency-table.js';
import distributionDiagram from './views/distribution-diagram.js';
import range from './views/components/range';

const size = 8;

const side = getSide(size);

const canvas = createCanvas(side);
const diagram = distributionDiagram(480, 480);

const rangeComponent = range({ min: 0, max: 1, step: 0.01 }, value => {
  console.log(value);
});

const seed = 42, roughness = 0.5;

const form = createForm(
  [
    { id: 'seed', value: seed, parse: value => +value }
  ],

  ({ seed }) => {
    draw(roughness, seed);
  }
);

function draw(roughness, seed) {
  const map = normalize(generate(8, roughness, seed), 255);

  const distribution = getFrequencyTable(map, 255);
  diagram.update(distribution);
  canvas.update(map);
}

draw(roughness, seed);

document.body.appendChild(canvas.element);
document.body.appendChild(diagram.element);
document.body.appendChild(rangeComponent.element);
document.body.appendChild(form.element);
