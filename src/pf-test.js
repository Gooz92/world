import { createElement } from 'utils/common/dom.utils.js';
import diamondSquareGenerator from 'utils/common/DiamondSquareGenerator.js';
import { normalize, getIndex } from 'utils/common/math.utils.js';

const TILE_SIZE = 14;

const generator = diamondSquareGenerator()
  .setCellSize(8)
  .setRows(9)
  .setCols(8)
  .build();

const { width, height } = generator.size;

const mapContainer = createElement('.map', {
  style: {
    width: `${TILE_SIZE * width}px`,
    height: `${TILE_SIZE * height}px`
  }
});

const map = normalize(
  generator.generate(1, 42).map(i => Math.sqrt(i * i * i)), 1
);

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const index = getIndex(x, y, width, height);
    const sign = map[index] ? '#' : ' ';

    const tile = createElement(`#tile-${x}-${y}`, {
      innerHTML: sign,
      dataset: { x, y }
    });

    mapContainer.appendChild(tile);
  }
}

mapContainer.addEventListener('click', e => {
  console.log(e.target.dataset);
});

document.body.appendChild(mapContainer);
