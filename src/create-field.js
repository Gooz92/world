import { createElement } from './utils/dom.utils.js';

const classes = [ 'empty', 'obstacle', 'tree', 'person' ];

const TILE_SIZE = 8;

export default function createField(tiles) {
  const height = tiles.length * TILE_SIZE;
  const width = tiles[0].length * TILE_SIZE;
  const cells = [];

  const table = createElement('div', {
    className: 'field',
    style: {
      width: width + 'px',
      height: height + 'px'
    }
  });

  for (let y = 0; y < tiles.length; y++) {
    const row = [];
    cells.push(row);
    for (let x = 0; x < tiles[0].length; x++) {
      const object = tiles[y][x].object;
      const objectType = object ? object.type : 0;
      const cell = createElement('div', {
        id: `tile-${x}-${y}`,
        className: classes[objectType]
      });
      row.push(cell);
      table.appendChild(cell);
    }
  }

  return { table, cells };
}
