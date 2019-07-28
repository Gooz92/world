import ViewportLayer from './ViewportLayer.js';
import { equal } from 'utils/common/assertion.js';

describe('ViewportLayer', function () {

  const TILE_SIZE = 8;

  let viewportStub;

  beforeEach(() => {
    viewportStub = {
      size: [ 16, 12 ],
      cellSize: TILE_SIZE,
      getSizeInPX: tiles => tiles * TILE_SIZE
    };
  });

  describe('#createCanvas()', function () {

    it('create canvas', () => {
      const layer = new ViewportLayer(viewportStub);
      const canvas = layer.createCanvas();

      equal(canvas.tagName, 'CANVAS');
    });

    it('set created canvas in `canvas` property', () => {
      const layer = new ViewportLayer(viewportStub);
      const canvas = layer.createCanvas();

      equal(canvas, layer.canvas);
    });
  });

  describe('setWidth, setHeight', function () {

    let layer;

    beforeEach(() => {
      layer = new ViewportLayer(viewportStub);
      layer.createCanvas();
    });

    it('setWidth change canvas width', () => {
      const newWidth = 12;
      layer.setWidth(newWidth);
      equal(layer.canvas.width, viewportStub.getSizeInPX(newWidth));
    });

    it('setHeight change canvas height', () => {
      const newHeight = 8;
      layer.setHeight(newHeight);
      equal(layer.canvas.height, viewportStub.getSizeInPX(newHeight));
    });

  });

});
