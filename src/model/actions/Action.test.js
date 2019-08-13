import Action from './Action.js';
import { isTrue, equal } from 'utils/common/assertion.js';

describe('Action', function () {

  describe('#perfom', function () {

    it('set completed to true', () => {
      const action = new Action();
      action.perform();
      isTrue(action.completed);
    });

  });

  describe('#getLeftDuration', () => {
    // actor.energy, action.cost, actor.strength

    function test(cost, strength, energy, expected) {
      const title = (
        [
          `action.cost=${cost}`,
          `actor.energy=${energy}`,
          `actor.strength=${strength}`
        ].join('; ') + ` : ${expected}`
      );

      it(title, () => {
        const actor = { energy, strength };
        const action = new Action(actor);
        action.cost = cost;

        const actual = action.getLeftDuration();
        equal(actual, expected);
      });
    }

    // TODO
    [
      [ 1, 1, 0, 1 ],
      [ 2, 1, 0, 2 ],
      [ 2, 1, 1, 1 ],
      [ 3, 1, 0, 3 ],
      [ 3, 1, 2, 1 ]
    ].forEach(params => test(...params));
  });

});
