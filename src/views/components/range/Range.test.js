import range from './Range.js';
import { assert } from 'chai';

describe('range', function () {

  it('create input element with type="range"', () => {
    const component = range();

    assert.include(component.element, {
      type: 'range',
      tagName: 'INPUT'
    });
  });

});
