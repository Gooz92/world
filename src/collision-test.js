import AsciiView from 'views/WorldView/ascii/AsciiView.js';

import COLLISIONS from 'model/behavior/test/collision-test-cases.js';
import select from 'views/components/select';
import { createWorld } from 'model/world/World.test-utils.js';

const TEST_CASES = COLLISIONS.filter(testCase => !testCase.skip);

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

  let moversCount = scenario.walks.length;

  const { width, height, ...config } = scenario;

  const world = createWorld(config, width, height);
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

const testCaseSelector = select(TEST_CASES, item => {
  run(item.data);
});

main.appendChild(testCaseSelector.element);

run(TEST_CASES[0].data);

document.getElementById('replay')
  .addEventListener('click', event => {
    run(testCaseSelector.selectedItem.data);
  });
