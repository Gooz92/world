import substitute from './substitute.js';
import { equal } from '../utils/assertion.js';

describe('substitute', function () {

  it('replace placeholders in templates with give values', () => {
    const tpl = 'Hello {name}!';
    const greeting = substitute(tpl, { name: 'Lain' });
    equal(greeting, 'Hello Lain!');
  });

});
