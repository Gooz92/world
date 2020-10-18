import select from './select.js';
import { equal, deepEqual } from 'utils/assertion.js';

describe('select', function () {

  it('create select element', () => {
    const { element } = select([]);
    equal(element.tagName, 'SELECT');
  });

  it('create options with given names', () => {
    const names = [ 'one', 'two', 'three' ];
    const { element } = select(names);

    const actualNames = Array.from(element.options)
      .map(option => option.innerText);

    deepEqual(actualNames, names);
  });

});
