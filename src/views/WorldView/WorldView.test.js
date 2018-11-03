import WorldView from './WorldView.js';
import { generateArray } from 'utils/array.utils.js';
import { assert } from 'chai';
import spyOn from 'test-utils/spy-on.js';
import { getSize, getPoint } from 'utils/geometry.utils.js';
import { getObject } from 'utils/fn.utils.js';

const tiles = [
  [ 1, 0, 1, 1, 0, 0, 2, 0 ],
  [ 2, 0, 0, 1, 0, 1, 0, 1 ],
  [ 0, 0, 0, 1, 2, 1, 0, 1 ],
  [ 2, 1, 0, 1, 0, 1, 0, 1 ],
  [ 0, 0, 0, 1, 0, 1, 0, 0 ],
  [ 0, 0, 0, 1, 2, 1, 0, 1 ]
];

describe('WorldView', function () {

  let worldView;

  beforeEach(function () {
    worldView = new WorldView({
      tiles: generateArray(6, y => (
        generateArray(8, x => ({
          object: { type: tiles[y][x] }
        }))
      ))
    }, {
      viewport: { size: { width: 4, height: 3 }, position: { x: 0, y: 0 } }
    });

    worldView.createField();
  });

  describe('scroll*', function () {

    it('viewport is not changed after down-down-up-up scroll', () => {
      const initialViewport = worldView.field.cloneNode(true);

      worldView.scrollDown();
      worldView.scrollDown();

      worldView.scrollUp();
      worldView.scrollUp();

      assert.isTrue(initialViewport.isEqualNode(worldView.field));
    });

    it('viewport is not changed after right-right-left-left scroll', () => {
      const initialViewport = worldView.field.cloneNode(true);

      worldView.scrollRight();
      worldView.scrollRight();

      worldView.scrollLeft();
      worldView.scrollLeft();

      assert.isTrue(initialViewport.isEqualNode(worldView.field));
    });

    it('viewport is not changed after right-down-left-up', () => {
      const initialViewport = worldView.field.cloneNode(true);

      worldView.scrollRight();
      worldView.scrollDown();

      worldView.scrollLeft();
      worldView.scrollUp();

      assert.isTrue(initialViewport.isEqualNode(worldView.field));
    });

  });

  describe('scrollDown', function () {

    it(`don't change viewport size`, () => {
      const cellCount = worldView.field.childNodes.length;
      worldView.scrollDown();
      assert.strictEqual(worldView.field.childNodes.length, cellCount);
    });

    it('create cells with correct coordinates', () => {
      const spy = spyOn(worldView, 'createCell');

      worldView.scrollDown();

      assert.deepStrictEqual(spy.calls, [
        [ 0, 3 ],
        [ 1, 3 ],
        [ 2, 3 ],
        [ 3, 3 ],
      ]);
    });

  });

  describe('scrollRight', function () {

    it(`don't change viewport size`, () => {
      const cellCount = worldView.field.childNodes.length;
      worldView.scrollRight();
      assert.strictEqual(worldView.field.childNodes.length, cellCount);
    });

    it('create cells with correct coordinates', () => {
      const spy = spyOn(worldView, 'createCell');

      worldView.scrollRight();

      assert.deepStrictEqual(spy.calls, [
        [ 4, 0 ],
        [ 4, 1 ],
        [ 4, 2 ]
      ]);
    });
  });

  describe('scrollLeft', function () {

    it(`don't change viewport size`, () => {
      const cellCount = worldView.field.childNodes.length;
      worldView.scrollLeft();
      assert.strictEqual(worldView.field.childNodes.length, cellCount);
    });

  });

  describe.skip('setViewportSize', function () {

    const setViewportSize = WorldView.prototype.setViewportSize;

    it('change viewport size', () => {
      const worldView = {
        viewport: {
          size: { width: 64, height: 48 },
          position: { x: 0, y: 0 }
        }
      };

      const newViewportSize = { width: 32, height: 24 };

      setViewportSize.call(worldView, newViewportSize.width, newViewportSize.height);

      assert.deepStrictEqual(worldView.viewport.size, newViewportSize);
    });

    it('recentre viewport if it decrease', () => {
      const worldView = {
        viewport: {
          position: { x: 3, y: 2 },
          size: { width: 4, height: 3 }
        }
      };

      const newViewportSize = { width: 2, height: 1 };
      const newViewportPosition = { x: 4, y: 3 };

      setViewportSize.call(worldView, newViewportSize.width, newViewportSize.height);

      assert.deepStrictEqual(worldView.viewport.position, newViewportPosition);
    });

  });

  describe('removeEdgeCells', function () {

    it('decrease cells count when removing top cells', () => {
      const childCount = worldView.field.childNodes.length;

      worldView.removeEdgeCells('up');

      assert.strictEqual(
        worldView.field.childNodes.length,
        childCount - worldView.viewport.size.width
      );
    });

    it('remove bottom row', () => {
      const childCount = worldView.field.childNodes.length;

      worldView.removeEdgeCells('down');

      assert.strictEqual(
        worldView.field.childNodes.length,
        childCount - worldView.viewport.size.width
      );
    });

    it('remove left column', () => {

      const childCount = worldView.field.childNodes.length;

      worldView.removeEdgeCells('left');

      assert.strictEqual(
        worldView.field.childNodes.length,
        childCount - worldView.viewport.size.height
      );
    });

    it('remove right column', () => {

      const childCount = worldView.field.childNodes.length;

      worldView.removeEdgeCells('right');

      assert.strictEqual(
        worldView.field.childNodes.length,
        childCount - worldView.viewport.size.height
      );

    });

    it('remove several right columns', () => {

      const childCount = worldView.field.childNodes.length;

      worldView.removeEdgeCells('right', 2);

      assert.strictEqual(
        worldView.field.childNodes.length,
        childCount - worldView.viewport.size.height * 2
      );

    });

  });

  describe('getCell()', function () {

    it('return cell with given coordinates', () => {
      const cell = worldView.getCell(2, 1);
      assert.strictEqual(cell, worldView.field.childNodes[6]);
    });
  });

  describe('inViewport', function () {

    let worldView;

    beforeEach(() => {
      worldView = new WorldView({
        tiles: generateArray(18, y => (
          generateArray(32, getObject)
        ))
      }, {
        viewport: {
          size: getSize(16, 9),
          position: getPoint(2, 3)
        }
      });
    });

    it('return true for point === viewport.position', () => {
      const { x, y } = worldView.viewport.position;
      assert.isTrue(worldView.inViewport(x, y));
    });

    it('return true if point placed in bottom right viewport corner', () => {
      const { width, height } = worldView.viewport.size;
      const { x, y } = worldView.viewport.position;

      assert.isTrue(worldView.inViewport(x + width - 1, y + height - 1));
    });

    it('return false if point above viewport', () => {
      const { x, y } = worldView.viewport.position;

      assert.isFalse(worldView.inViewport(x + 1, y - 1));
    });

    it('return false if point below viewport', () => {
      const { height } = worldView.viewport.size;
      const { x, y } = worldView.viewport.position;

      assert.isFalse(worldView.inViewport(x + 1, y + height + 1));
    });

    it('return false if point righter than viewport', () => {
      const { width } = worldView.viewport.size;
      const { x, y } = worldView.viewport.position;

      assert.isFalse(worldView.inViewport(x + width + 1, y + 1));
    });

    it('return false if point lefter than viewport', () => {
      const { x, y } = worldView.viewport.position;

      assert.isFalse(worldView.inViewport(x - 1, y + 1));
    });

    it('return true if viewport is placed by either (h) side of map', () => {
      worldView.viewport.position.x = 24;
      assert.isTrue(worldView.inViewport(4, 4));
    });

    it('return true if viewport is placed by either (v) side of map', () => {
      worldView.viewport.position.y = 12;
      assert.isTrue(worldView.inViewport(0, 2));
    });

  });

});
