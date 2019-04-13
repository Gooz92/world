import Viewport from './Viewport.js';

import { assert } from 'chai';

describe('Viewport', function () {

  describe('#new', function () {

    it('set default cell size', () => {
      const world = {};
      const viewport = new Viewport(world, [ 16, 12 ]);

      assert.strictEqual(viewport.cellSize, Viewport.DEFAULT_CELL_SIZE);
    });

  });

  describe('#createCanvas()', function () {

    it('create canvas', () => {
      const world = {};
      const viewport = new Viewport(world, [ 16, 12 ]);
      const canvas = viewport.createCanvas();

      assert.strictEqual(canvas.tagName, 'CANVAS');
    });

  });

  describe('#setWidth()', function () {

    it('change viewport width', () => {
      const world = {};
      const viewport = new Viewport(world, [ 16, 12 ]);
      viewport.createCanvas();

      const width = 10;

      viewport.setWidth(width);

      assert.strictEqual(viewport.width, width);
    });

  });

  describe('#setHeight()', function () {

    it('change viewport height', () => {
      const world = {};
      const viewport = new Viewport(world, [ 16, 12 ]);
      viewport.createCanvas();

      const height = 10;

      viewport.setHeight(height);

      assert.strictEqual(viewport.height, height);
    });

  });

});
