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

});
