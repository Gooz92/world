import Inventory from './Inventory.js';
import { equal } from 'utils/common/assertion.js';

const matter = { id: 1, name: 'matter' };

describe('Inventory', function () {

  describe('add', function () {

    it('works', () => {
      const inventory = new Inventory(10);
      const amount = 3;
      inventory.add(matter, amount);

      equal(inventory.getAmount(matter), amount);
    });

  });
});
