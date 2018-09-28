import WorldView from './WorldView.js';
import { assert } from 'chai';

describe('WorldView', function () {

  describe('#init', function () {

    it('init action hadlers', () => {
      const wv = new WorldView('world');
      wv.init();

      assert.deepStrictEqual(wv.handlers, {
        cutTree: wv.handleCutTree,
        move: wv.handleMove
      });

    });

  });

});
