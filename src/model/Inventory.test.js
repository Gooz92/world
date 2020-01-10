import Inventory from './Inventory.js';
import { equal } from 'utils/common/assertion.js';

const wood = { id: 1, name: 'wood' },
  stone = { id: 2, name: 'stone' };

describe('Inventory', function () {

  describe('add', function () {

    it('add given amount of items in inventory', () => {
      const inventory = new Inventory(10);
      const amount = 3;
      inventory.add(wood, amount);

      equal(inventory.getAmount(wood), amount);
    });

  });

  describe('remove', function () {

    it('remove items of given type from inventory', () => {
      const inventory = new Inventory(10);
      const amount = 2;

      inventory.add(wood, amount);

      inventory.remove(wood);

      equal(inventory.getAmount(wood), 0);
    });

    it('available amount should be increased', () => {
      const inventory = new Inventory(10);

      const woodAmount = 2, stoneAmount = 3;

      inventory.add(wood, woodAmount);
      inventory.add(stone, stoneAmount);

      inventory.remove(wood);

      equal(inventory.getAvailableCapacity(), 7);
    });

  });

});
