import * as isUtils from './is.utils.js';
import { omit } from './object.utils.js';
import { upperFirst } from './string.utils.js';
import { isTrue, isFalse } from './assertion.js';

const types = {
  undefined: void 0,
  function: () => 0,
  array: [],
  object: {}
};

describe('isUtils', function () {
  Object.keys(types)
    .forEach(typeName => {

      const methodName = `is${upperFirst(typeName)}`;
      const method = isUtils[methodName];
      const value = types[typeName];

      const otherTypes = omit(types, [ typeName ]);

      describe(methodName, () => {

        it(`should return true for ${typeName}`, () => {
          isTrue(method(value));
        });

        Object.keys(otherTypes)
          .forEach(otherTypeName => (
            it(`should return false for ${otherTypeName}`, () => {
              const value = otherTypes[otherTypeName];
              isFalse(method(value));
            })
          ));

      });

    });
});
