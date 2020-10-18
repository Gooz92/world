import createEnum from './create-enum.js';
import { noop } from './common/fn.utils.js';
import { isTrue } from './assertion.js';

describe('createEnum', function () {
  it('create enum member with give name', () => {
    const name = 'BAR';
    const Foo = createEnum(noop, { [ name ]: [] });
    isTrue(Foo.hasOwnProperty(name));
  });
});
