import getArrowKeyCode from '../get-arrow-key-code.js';
import { equal } from '../assertion.js';

const cases = {
  ArrowUp: 'up',
  Up: 'up',
  up: 'up',

  ArrowLeft: 'left',
  Left: 'left',
  left: 'left',

  ArrowDown: 'down',
  Down: 'down',
  down: 'down',

  ArrowRight: 'right',
  Right: 'right',
  right: 'right',

  east: null,
  west: null,
  top: null
};

describe('getArrowKeyCode', function () {

  Object.keys(cases)
    .forEach(input => {
      const output = cases[input];
      it(`${input} => ${output}`, () => {
        equal(getArrowKeyCode(input), output);
      });
    });
});
