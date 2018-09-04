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

  describe('getTrue', function () {

    const getTrue = fnUtils.getTrue;

    it('return true', () => {
      assert.isTrue(getTrue());
    });

  });

  describe('getFalse', function () {

    const getFalse = fnUtils.getFalse;

    it('return false', () => {
      assert.isFalse(getFalse());
    });

  });

  describe('getObject', function () {

    const getObject = fnUtils.getObject;

    it('create object', () => {
      assert.deepEqual(getObject(), {});
      assert.notStrictEqual(getObject(), getObject());
    });

  });

});
