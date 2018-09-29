import * as isUtils from './is.utils.js';
import { upperFirst } from './string.utils.js';
import { assert } from 'chai';

const types = {
  'undefined': void 0,
  'function': () => 0
};

describe('isUtils', function () {
  Object.keys(types)
    .forEach(typeName => {
  
      const methodName = `is${upperFirst(typeName)}`;
      const method = isUtils[methodName];
      const value = types[typeName];

      describe(methodName, () => {
        it(`should return true for ${typeName}`, () => {
          assert.isTrue(method(value));
        });
      });

    });
});
