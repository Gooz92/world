import { generate, getSide } from 'utils/common/diamond-square.js';
import { normalize } from 'utils/common/math.utils.js';
import createCanvas from './views/canvas.js';
import createForm from './views/form.js';
import getFrequencyTable from 'utils/common/frequency-table.js';
import distributionDiagram from './views/distribution-diagram.js';
import range from './views/components/range';


const canvas = createCanvas(576, 512);
const diagram = distributionDiagram(480, 480);

let seed = 42, roughness = 0.5;

const onRoughnessChange = value => {
  draw(value, seed);
  roughness = value;
};

const rangeComponent = range('roughness', 'Roughness', {
  min: 0, max: 1, step: 0.01
}, onRoughnessChange);

const form = createForm(
  [
    { id: 'seed', value: seed, parse: value => +value }
  ],

  ({ seed }) => {
    draw(roughness, seed);
  }
);

function draw(roughness, seed) {
  const map = normalize(generate(8, 7, 64, roughness, seed), 255);

  const distribution = getFrequencyTable(map, 255);
  diagram.update(distribution);
  canvas.update(map);
}

draw(roughness, seed);

document.body.appendChild(canvas.element);
document.body.appendChild(diagram.element);
document.body.appendChild(rangeComponent.element);
document.body.appendChild(form.element);
