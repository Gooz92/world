import diamondSquareGenerator from 'utils/DiamondSquareGenerator.js';
import { normalize } from 'utils/common/math.utils.js';
import createCanvas from './views/components/canvas.js';
import getFrequencyTable from 'utils/frequency-table.js';
import distributionDiagram from './views/distribution-diagram.js';
import range from './views/components/range';
import createSeedComponent from './views/components/seed';

const generator = diamondSquareGenerator()
  .setCellSize(32)
  .setRows(16)
  .setCols(18)
  .build();

const { width, height } = generator.size;

const canvas = createCanvas(width, height);
const diagram = distributionDiagram(260);

let seed = 42, roughness = 0.5;

const seedComponent = createSeedComponent(seed, value => {
  draw(roughness, value);
  seed = value;
});

const onRoughnessChange = value => {
  draw(value, seed);
  roughness = value;
};

const rangeComponent = range('roughness', 'Roughness', {
  min: 0, max: 1, step: 0.01
}, onRoughnessChange);

function draw(roughness, seed) {
  const map = normalize(
    generator.generate(roughness, seed).map(i => Math.sqrt(i * i * i)), 1
  ).map(i => i ? 0 : 255);

  const distribution = getFrequencyTable(map, 255);
  diagram.update(distribution);
  canvas.update(map);
}

draw(roughness, seed);

const left = document.getElementById('left'),
  right = document.getElementById('right');

left.appendChild(canvas.element);
right.appendChild(rangeComponent.element);
right.appendChild(seedComponent.element);
right.appendChild(diagram.element);
