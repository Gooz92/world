import ViewportLayer from './ViewportLayer.js';
import { equal } from 'utils/common/assertion.js';

describe('ViewportLayer', function () {
  describe('#createCanvas()', function () {

    it('create canvas', () => {
      const layer = new ViewportLayer( { size: [ 16, 12 ] });
      const canvas = layer.createCanvas();

      equal(canvas.tagName, 'CANVAS');
    });

    it('set created canvas in `canvas` property', () => {
      const layer = new ViewportLayer( { size: [ 16, 12 ] });
      const canvas = layer.createCanvas();

      equal(canvas, layer.canvas);
    });
  });

});
