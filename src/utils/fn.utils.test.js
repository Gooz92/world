import * as fnUtils from './fn.utils.js';
import { assert } from 'chai';

describe('fnUtils', function () {

  describe('noop', function () {

    it('do nothing', () => {
      fnUtils.noop();
    });

  });

  describe('identity', function () {

    const identity = fnUtils.identity;

    it('return given argument', () => {
      const variable = 'value';
      assert.strictEqual(identity(variable), variable);
    });

    it('not copy given argument', () => {
      const box = {};
      assert.notEqual(identity(box), {});
    });

  });

  describe('constant', function () {

    const constant = fnUtils.constant;

    it('return function wich return given argument', () => {
      const one = constant(1);
      assert.strictEqual(one(), 1)
    });

    it('returned function not copy given argument', () => {
      const box = {};
      const getBox = constant(box);
      assert.notEqual(getBox(), {});
    });

  });

});
