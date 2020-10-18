import { deepEqual, equal } from './assertion.js';
import { parseParams, stringifyParams } from './params.js';

const toNumber = value => +value;

describe('params', function () {

  describe('parseParams', function () {
    it('parse params string into object using config', () => {
      const params = 'x:1;y:2';
      const config = {
        x: toNumber,
        y: toNumber
      };

      const parsed = parseParams(params, config);

      deepEqual(parsed, { x: 1, y : 2 });
    });
  });

  describe('stringifyParams', function () {
    it('convert params object to string using config', () => {
      const width = 16, height = 9, seed = 42;

      const seedFormatter = seed => seed.toString(36);

      const params = { seed, width, height };

      const paramsString = stringifyParams(params, { seed: seedFormatter });

      equal(paramsString, `seed:${seedFormatter(seed)};width:${width};height:${height}`);
    });
  });

});
