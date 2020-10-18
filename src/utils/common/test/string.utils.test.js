import * as stringUtils from '../string.utils.js';
import { equal } from '../assertion.js';

describe('stringUtils', function () {

  describe('lowerFirst', function () {

    const lowerFirst = stringUtils.lowerFirst;

    it('converts the first character of string to lower case', () => {
      equal(lowerFirst('Name'), 'name');
    });

  });

  describe('upperFirst', function () {

    const upperFirst = stringUtils.upperFirst;

    it('converts the first character of string to lower case', () => {
      equal(upperFirst('name'), 'Name');
    });

  });

  describe('camelCase', function () {

    const camelCase = stringUtils.camelCase;

    [
      [ [ 'HEAD_BODY_TALE' ], 'headBodyTale' ],
      [ [ 'first_second' ], 'firstSecond' ],
      [ [ 'path.with.segments', '.' ], 'pathWithSegments' ]
    ].forEach(([ args, expected ]) => {
      it(args.map(arg => `"${arg}"`).join(', ') + ' => ' + expected, () => {
        equal(camelCase(...args), expected);
      });
    });

  });

  describe('stringify', function () {

    const stringify = stringUtils.stringify;

    it('empty object (depth = 0)', () => {
      const str = stringify({}, 0);
      equal(str, '{}');
    });

    it('empty array (depth = 0)', () => {
      const str = stringify([], 0);
      equal(str, '[]');
    });

    it('non-empty object (depth = 0)', () => {
      const str = stringify({ key: 'value' }, 0);
      equal(str, '{...}');
    });

    it('non-empty array (depth = 0)', () => {
      const str = stringify([ 1 ], 0);
      equal(str, '[...]');
    });

    it('non-empty array (depth = 1)', () => {
      const arr = [ 1, 2, 3 ];
      const str = stringify(arr, 1);
      equal(str, '[ 1, 2, 3 ]');
    });

    it('non-empty object (depth = 1)', () => {
      const p = { x: 1, y: 2 };
      const str = stringify(p, 1);
      equal(str, '{ x: 1, y: 2 }');
    });

    it('nested arrays', () => {
      const arr = [ true, null, undefined, NaN, 1, 'asd' ];
    });
  });

});
