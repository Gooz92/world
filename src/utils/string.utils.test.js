import * as stringUtils from './string.utils.js';
import { assert } from 'chai';

describe('stringUtils', function () {

  describe('lowerFirst', function () {

    const lowerFirst = stringUtils.lowerFirst;

    it('converts the first character of string to lower case', () => {
      assert.strictEqual(lowerFirst('Name'), 'name')
    });

  });

});
