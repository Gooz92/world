import assignProperties from '../assign-properties.js';
import { equal } from 'utils/assertion.js';

describe('assignProperties', function () {

  it('assign properties', () => {
    const element = document.createElement('div');

    const id = 'unique', innerHTML = 'hi!';

    assignProperties(element, { id, innerHTML });

    equal(element.id, id);
    equal(element.innerHTML, innerHTML);
  });

  it('auto-detect attributes', () => {
    // htmlFor property reflects 'for' attribute
    const id = 'name';
    const label = document.createElement('label');

    assignProperties(label, { for: id } );

    equal(label.htmlFor, id);
  });

});
