import Action from './Action.js';
import { assert } from 'chai';

describe('Action', function () {

  describe('#perfom', function () {

    it('set completed to true', () => {
      const action = new Action();
      action.perform();
      assert.isTrue(action.completed);
    });

    it('retun { type, data }', () => {
      const actor = {};
      const data = 'info';
      const type = 'act';
  
      const action = new Action(actor, data);
      action.type = type;

      assert.deepStrictEqual(action.perform(), { type, data });
    });

  });

});