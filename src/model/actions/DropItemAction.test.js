import DropItemAction from './DropItemAction.js';
import World from 'model/World.js';

import { generateArray } from 'utils/common/array.utils.js';
import { getObject } from 'utils/common/fn.utils.js';

import ObjectType from 'model/ObjectType.enum.js';
import ResourceType from 'model/ResourceType.enum.js';

import { equal } from 'utils/common/assertion.js';

describe('DropItemAction', function () {

  describe('#perform()', function () {

    /*
     *     2
     * . . . . . .
     * . . . . . .
     * . . - - . .
     * . . - - . . 3
     * . . @ . . . 4
     * . . . . . .
     */

    let actor;

    beforeEach(() => {
      const tiles = generateArray(6, 6, getObject);
      const world = new World(tiles);

      actor = world.place(2, 4, ObjectType.PERSON);
      actor.inventory.add(ResourceType.WOOD, 10);
    });

    it('place resorce on give tile', () => {
      const action = new DropItemAction(actor, [ [ 2, 3 ] ], ResourceType.WOOD);
      action.perform();
      const tile = actor.world.getTile(2, 3);
      equal(tile.object.type, ResourceType.WOOD);
    });

  });

});
