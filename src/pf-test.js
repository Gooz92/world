import { createElement } from 'utils/common/dom.utils.js';
import diamondSquareGenerator from 'utils/common/DiamondSquareGenerator.js';
import { normalize, getIndex } from 'utils/common/math.utils.js';
import * as objectUtils from 'utils/common/object.utils.js';
import PathFinder from 'utils/path-finding/PathFinder.js';
import { chunk } from 'utils/common/array.utils.js';
import { smoothPath, expandPath } from 'utils/path-finding/path-finding.utils.js';

const TILE_SIZE = 14;

const generator = diamondSquareGenerator()
  .setCellSize(4)
  .setRows(4)
  .setCols(3)
  .build();

const { width, height } = generator.size;

console.log(width, height);

const mapContainer = createElement('.map', {
  style: {
    width: `${TILE_SIZE * width}px`,
    height: `${TILE_SIZE * height}px`,
    outline: '1px solid #777'
  }
});

const map = normalize(
  generator.generate(1, 42).map(i => Math.sqrt(i * i * i)), 1
);

const tiles = chunk(map, width);

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

const pf = {
  setPoint(point) {
    if (this.isStartSetted) {
      this.setEnd(point);
    } else {
      this.setStart(point);
    }
  },

  setStart(point) {
    this.isStartSetted = true;
    this.start = point;
  },

  setEnd(point) {
    this.isStartSetted = false;
    this.end = point;

    const pf = new PathFinder({
      isTileFound: (tile, x, y) => (
        x === this.end.x && y === this.end.y
      ),
      isTilePassable: tile => !tile
    });

    const { path } = pf.find(tiles, this.start.x, this.start.y);
    console.log('path: ', path);

    const smoothed = smoothPath(path, (x, y) => !tiles[y][x], width, height);
    console.log('smoothed: ', smoothed);
    const expanded = expandPath(smoothed, width, height);
    console.log('expanded:', expanded);

    expanded.forEach(([ x, y ]) => {
      document.getElementById(`tile-${x}-${y}`).innerHTML = '*';
    });
  }
};

mapContainer.addEventListener('click', ({ target: { dataset } }) => {
  const point = objectUtils.map(dataset, value => parseInt(value));
  pf.setPoint(point);
});

document.body.appendChild(mapContainer);
