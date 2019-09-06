import AsciiView from 'views/WorldView/ascii/AsciiView.js';

import World from 'model/World';
import WalkStrategy from 'model/strategies/WalkStrategy.js';
import Direction from 'model/Direction.enum.js';

import { generateArray } from 'utils/common/array.utils.js';
import { getObject } from 'utils/common/fn.utils.js';

import {
  addWalls,
  calculateDirections
} from 'utils/path-finding/path-finding.test-utils.js';

import { COLLISIONS } from 'model/strategies/test-cases.js';
import select from 'views/components/select';

const main = document.querySelector('main');

function run(scenario) {

  const prevField = main.querySelector('.' + AsciiView.CLASS_NAME);

  if (prevField) {
    prevField.parentElement.removeChild(prevField);
  }

  const { width, height } = scenario;

  const tiles = generateArray(height, width, getObject);

  addWalls(tiles);

  const world = new World(tiles);

  scenario.walks.forEach(path => {
    const [ x, y ] = path[0];
    const person = world.placePerson(x, y);
    const direction = Direction.fromPoints(path[0], path[1]);

    person.setStrategy(WalkStrategy, {
      // walking path should not include start actor position
      path: calculateDirections(path.slice(1), direction)
    });
  });

  const view = new AsciiView(world);

  const field = view.createElement();

  main.appendChild(field);
}

const testCaseSelector = select(COLLISIONS, item => {
  run(item.data);
});

main.appendChild(testCaseSelector.element);
