import substitute from '../substitute.js';
import { assert } from 'chai';

describe('substitute', function () {

  it('replace placeholders in templates with give values', () => {
    const tpl = 'Hello {name}!';
    const greeting = substitute(tpl, { name: 'Lain' });
    assert.strictEqual(greeting, 'Hello Lain!');
  });

});
