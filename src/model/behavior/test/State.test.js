import State from '../State.js';
import { equal } from 'utils/assertion.js';

describe('State', function () {

  describe('.getName', function () {
    it('works', () => {

      const subState = new class SubState extends State {};
      const name = subState.getName();
      equal(name, 'sub');
    });
  });

});
