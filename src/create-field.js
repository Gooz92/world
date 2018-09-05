import { createTable } from './utils/dom.utils.js';

const classes = [ 'empty', 'obstacle', 'tree', 'person' ];

export default function createField(tiles) {
  const cells = [];

  const table = createTable(tiles.length, tiles[0].length, (cell, y, x) => {
    const object = tiles[y][x].object;
    const objectType = object ? object.type : 0;

    cell.className = classes[objectType];

    cell.id = `tile-${x}-${y}`;

    (cells[y] || (cells[y] = []))[x] = cell;
  });

  return { table, cells };
}
