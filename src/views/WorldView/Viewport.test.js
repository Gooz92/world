import Viewport from './Viewport.js';

import { assert } from 'chai';

describe('Viewport', function () {

  describe('#initCanvas()', function () {

    it('create canvas', () => {
      const viewport = new Viewport([ 0, 0 ], [ 16, 12 ]);
      viewport.initCanvas();

      assert.strictEqual(viewport.canvas.tagName, 'CANVAS');
    });

  });

});
