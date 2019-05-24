import range from './Range.js';
import { equal } from 'utils/common/assertion.js';

describe('range', function () {

  it('create input element with type="range"', () => {
    const component = range();

    equal(component.input.type, 'range');
    equal(component.input.tagName, 'INPUT');
  });

});
