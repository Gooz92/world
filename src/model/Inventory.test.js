import Inventory from './Inventory.js';
import { equal } from 'utils/common/assertion.js';

const matter = { id: 1, name: 'matter' };

describe('Inventory', function () {

  describe('add', function () {

    it('add given amount of items ti inventory', () => {
      const inventory = new Inventory(10);
      const amount = 3;
      inventory.add(matter, amount);

      equal(inventory.getAmount(matter), amount);
    });

  });

  describe('remove', function () {

    it('remove items of given type from inventory', () => {
      const inventory = new Inventory(10);
      const amount = 2;

      inventory.add(matter, amount);

      inventory.remove(matter);

      equal(inventory.getAmount(matter), 0);
    });

  });

});
