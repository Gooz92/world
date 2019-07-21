import WorldView from './WorldView.js';

describe('WorldView', function () {

  describe('#new()', function () {

    it('it works', () => {
      new WorldView(null, { viewportSize: [ 4, 3 ] });
    });

  });

});
