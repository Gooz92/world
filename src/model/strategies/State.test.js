import State from './State.js';
import { equal } from 'utils/common/assertion.js';

describe('State', function () {

  describe('.getName', function () {
    it('works', () => {

      const subState = new class SubState extends State {};
      const name = subState.getName();
      equal(name, 'sub');
    })
  });

});
