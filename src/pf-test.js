import { createElement } from 'utils/common/dom.utils.js';
import diamondSquareGenerator from 'utils/common/DiamondSquareGenerator.js';
import { normalize, getIndex } from 'utils/common/math.utils.js';
import PathFinder from 'utils/path-finding/PathFinder.js';
import { chunk } from 'utils/common/array.utils.js';

const TILE_SIZE = 14;

const generator = diamondSquareGenerator()
  .setCellSize(8)
  .setRows(6)
  .setCols(8)
  .build();

const { width, height } = generator.size;

console.log(width, height);

const canvas = createElement('canvas', {
  width: TILE_SIZE * width,
  height: TILE_SIZE * height,
  style: {
    outline: '1px solid #777'
  }
});

const ctx = canvas.getContext('2d');

const map = normalize(
  generator.generate(1, 42).map(i => Math.sqrt(i * i * i)), 1
);

const tiles = chunk(map, width);

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const index = getIndex(x, y, width, height);

    if (map[index]) {
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
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

    ctx.fillStyle = '#888';

    path.forEach(({ position: [ x, y ] }) => {
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });
  }
};

canvas.addEventListener('click', event => {
  const { left, top } = event.target.getBoundingClientRect();

  const x = Math.floor((event.clientX - left) / TILE_SIZE);
  const y = Math.floor((event.clientY - top) / TILE_SIZE);

  pf.setPoint({ x, y });
});

document.body.appendChild(canvas);
