import { generateArray } from '../utils/array.utils.js';
import PathFinder from '../PathFinder.js';
import createField from '../create-field.js';

const WIDTH = 68;
const HEIGHT = 70;

const START = 3;
const END = 4;

const START_X = 5;
const START_Y = 15;

const END_X = 62;
const END_Y = 65;

const objects = [
  { position: [ START_X, START_Y ], type: START },
  { position: [ END_X, END_Y ], type: END }
];

const tiles = generateArray(HEIGHT, y => (
  generateArray(WIDTH, x => {
    const object = objects.find(o => {
      const [ x0, y0 ] = o.position;
      return x0 === x && y0 === y;
    });

    return object ? object.type : 0;
  })
));

const finder = new PathFinder({
  isTileFound: tile => tile === END
});

export default function () {

  const { path } = finder.find(tiles, START_X, START_Y);

  const { table, cells } = createField(tiles, tile => {
    if (tile === 3) return { style: { backgroundColor: 'red' } };
    if (tile === 4) return { style: { backgroundColor: 'green' } };

    return {};
  });

  path.forEach(([ x, y ]) => {
    cells[y][x].style.backgroundColor = 'gray';
  });

  document.body.appendChild(table);
}
