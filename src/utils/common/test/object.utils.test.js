import * as objectUtils from '../object.utils.js';
import spy from 'test-utils/spy.js';
import { deepEqual, equal } from '../assertion.js';

describe('objectUtils', function () {

  describe('omit', function () {

    const omit = objectUtils.omit;

    it('return copy of given object without given keys', () => {
      const rectangle = { x: 1, y: 2, width: 3, height: 4 };
      const point = omit(rectangle, [ 'width', 'height' ]);
      deepEqual(point, { x: 1, y: 2 });
    });

  });

  describe('map', function () {

    const map = objectUtils.map;

    it('return empty object for empty object', () => {
      const empty = map({});
      deepEqual(empty, {});
    });

    it('creates an object with values generated by callback', () => {
      const size = map({
        width: 16,
        height: 9
      }, value => `${value}px`);

      deepEqual(size, { width: '16px', height: '9px' });
    });

  });

  describe('forIn', function () {

    const forIn = objectUtils.forIn;

    it('invoke callback for each object property', () => {

      const rectangle = {
        x: 1,
        y: 3,

        width: 3,
        height: 4
      };

      const spyCallback = spy();

      forIn(rectangle, spyCallback);

      deepEqual(spyCallback.calls, [
        [ 1, 'x' ],
        [ 3, 'y' ],
        [ 3, 'width' ],
        [ 4, 'height' ]
      ]);

    });

  });

  describe('get', function () {
    const get = objectUtils.get;

    it('return nested object by path', () => {
      const obj = { a: { b: { c: 'abc' } } };
      const abc = get(obj, 'a.b.c');
      equal(abc, obj.a.b.c);
    });

    it('return null if nested field not found', () => {
      const obj = { x: { y: { z: {} } } };
      const none = get(obj, 'x.a.z');
      equal(none, undefined);
    });

    it('return undefined if first argument is not an object', () => {
      equal(get(null, 'field'), undefined);
    });
  });

});
