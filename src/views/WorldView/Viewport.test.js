import Viewport from './Viewport.js';

import { assert } from 'chai';

describe('Viewport', function () {

  describe('#createCanvas()', function () {

    it('create canvas', () => {
      const world = {};
      const viewport = new Viewport(world, [ 0, 0 ], [ 16, 12 ]);
      const canvas = viewport.createCanvas();

      assert.strictEqual(canvas.tagName, 'CANVAS');
    });

  });

});
