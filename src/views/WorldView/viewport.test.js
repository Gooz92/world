import { insertionOptions } from './viewport.js';
import { assert } from 'chai';
import { last } from 'utils/array.utils.js';

describe('insertionOptions', function () {

  const width = 4, height = 2;
  const viewportX = 3, viewportY = 2;

  let options, getCellCoordinates;

  describe('up', function () {

    beforeEach(() => {
      options = insertionOptions.up(viewportX, viewportY, width);
    });

    describe('getCellCoordinates', function () {

      beforeEach(() => {
        getCellCoordinates = options[0];
      });

      it('return top right position firstly', () => {
        const [ x, y ] = getCellCoordinates(0, 0);
        assert.strictEqual(x, viewportX + width - 1);
        assert.strictEqual(y, viewportY - 1);
      });

    });

    it('options contains width', () => {
      assert.strictEqual(last(options), width);
    });

  });

  describe('down', function () {

    beforeEach(() => {
      options = insertionOptions.down(viewportX, viewportY, width, height);
    });

    describe('getCellCoordinates', function () {

      beforeEach(() => {
        getCellCoordinates = options[0];
      });

      it('return down left coordinates firstly', () => {
        const [ x, y ] = getCellCoordinates(0, 0);
        assert.strictEqual(x, viewportX);
        assert.strictEqual(y, viewportY + height);
      });

    });

    it('options contains width', () => {
      assert.strictEqual(last(options), width);
    });

  });

});
