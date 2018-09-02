import Action from './Action.js';
import { assert } from 'chai';

describe('Action', function () {

  describe('#perfom', function () {

    it('set completed to true', () => {
      const action = new Action();
      action.perform();
      assert.isTrue(action.completed);
    });

  });

});