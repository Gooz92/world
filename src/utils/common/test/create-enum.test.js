import createEnum from '../create-enum.js';
import { noop } from '../fn.utils.js';

import { assert } from 'chai';

describe('createEnum', function () {
  it('create enum member with give name', () => {
    const name = 'BAR';
    const Foo = createEnum(noop, { [ name ]: [] });
    assert.isDefined(Foo[name]);
  });
});
