import Action from './Action.js';
import { isTrue } from 'utils/common/assertion.js';

describe('Action', function () {

  describe('#perfom', function () {

    it('set completed to true', () => {
      const action = new Action();
      action.perform();
      isTrue(action.completed);
    });

  });

});
