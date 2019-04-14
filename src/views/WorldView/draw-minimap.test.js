import drawMinimap from './draw-minimap.js';
import { generateArray } from 'utils/common/array.utils.js';
import { assert } from 'chai';

describe('drawMinimap', function () {

  const tiles = generateArray(16, () => generateArray(16));

  it.skip('return canvas', () => {
    const element = drawMinimap(tiles);
    assert.strictEqual(element.tagName, 'CANVAS');
  });

});
