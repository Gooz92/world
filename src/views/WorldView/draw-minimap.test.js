import drawMinimap from './draw-minimap.js';
import { assert } from 'chai';
import { generateArray } from 'utils/array.utils.js';

describe('drawMinimap', function () {

  const tiles = generateArray(16, () => generateArray(16));

  it.skip('return canvas', () => {
    const element = drawMinimap(tiles);
    assert.strictEqual(element.tagName, 'CANVAS');
  });

});
