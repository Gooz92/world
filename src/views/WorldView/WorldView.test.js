import WorldView from './WorldView.js';
import { generateArray } from 'utils/array.utils.js';
import { getObject } from 'utils/fn.utils.js';

import { assert } from 'chai';

describe('WorldView', function () {
  let worldView;

  beforeEach(() => {
    worldView = new WorldView({
      tiles: generateArray(9, generateArray(12, getObject))
    });
  });

  describe('#createCanvas()', function () {

    it('return canvas', () => {
      const canvas = worldView.createCanvas();
      assert.strictEqual(canvas.tagName, 'CANVAS');
    });
  });

});
