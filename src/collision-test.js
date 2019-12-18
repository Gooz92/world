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
import ObjectType from 'model/ObjectType.enum.js';
import Strategy from 'model/strategies/Strategy';

const main = document.querySelector('main'),
  replayButton = document.getElementById('replay');

let timerId;

function run(scenario) {

  clearInterval(timerId);

  const prevField = main.querySelector('.' + AsciiView.CLASS_NAME);

  replayButton.disabled = true;

  if (prevField) {
    prevField.parentElement.removeChild(prevField);
  }

  const { width, height } = scenario;

  const tiles = generateArray(height, width, getObject);

  addWalls(tiles);

  const world = new World(tiles);

  let moversCount = scenario.walks.length;

  scenario.walks.forEach(path => {
    const [ x, y ] = path[0];
    const person = world.placePerson(x, y);
    const direction = Direction.fromPoints(path[0], path[1]);

    person.setStrategy(WalkStrategy, {
      // walking path should not include start actor position
      path: calculateDirections(path.slice(1), direction),

      onDone() {
        --moversCount;
        return { Strategy: Strategy.IDLE };
      }
    });
  });

  (scenario.idlers || []).forEach(([ x, y ]) => {
    world.placePerson(x, y);
  });

  (scenario.obstacles || []).forEach(([ x, y ]) => {
    world.place(x, y, ObjectType.OBSTACLE);
  });

  const view = new AsciiView(world);

  const field = view.createElement();

  main.appendChild(field);

  timerId = setInterval(() => {
    view.tick();
    if (moversCount === 0 && replayButton.disabled) {
      replayButton.disabled = false;
    }
  }, 300);
}

const testCaseSelector = select(COLLISIONS, item => {
  run(item.data);
});

main.appendChild(testCaseSelector.element);

run(COLLISIONS[0].data);

document.getElementById('replay')
  .addEventListener('click', event => {
    run(testCaseSelector.selectedItem.data);
  });
