import WorldView from './WorldView.js';

describe('WorldView', function () {

  describe('#new()', function () {

    it('it works', () => {
      new WorldView(null, { viewport: { size: [ 4, 3 ] } });
    });

  });

  // TODO: implement tests
  describe.skip('isSelectionMoved()', function () {

    it('return false if there is no selection');

    it('return false if selected object has no position (can not moved)');

    it('return true if selected object is moved');

    it('return false if selected object is moved');

  });

  // TODO: implement tests
  describe.skip('select', function () {

    it('store selected object in "selected" field');
    it('return selected obejct');
  });

});
