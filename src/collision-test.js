import AsciiView from 'views/WorldView/AsciiView.js';
import World from 'model/World';

import { generateArray } from 'utils/common/array.utils.js';
import { getObject } from 'utils/common/fn.utils.js';

const tiles = generateArray(10, 10, getObject);
const world = new World(tiles);

const view = new AsciiView(world);

const field = view.createElement();

document.querySelector('main').appendChild(field);
