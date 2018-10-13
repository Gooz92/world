import createHandlers, { doMatch } from './create-handlers.js';
import { assert } from 'chai';

describe('doMatch', function () {

  it(`return false if methodName isn't match hadler pattern`, () => {
    assert.isFalse(doMatch('method'));
  });

  it('return action name if methodName match pattern', () => {
    const methodName = 'handleMove';
    const actioName = doMatch(methodName);
    assert.strictEqual(actioName, 'move');
  });

});
