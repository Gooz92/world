import DropItemAction from './DropItemAction.js';

import ObjectType from 'model/ObjectType.enum.js';
import ResourceType from 'model/ResourceType.enum.js';

import { equal } from 'utils/assertion.js';
import { createEmptyWorld } from 'model/world/World.test-utils.js';

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
      const world = createEmptyWorld(6, 6);

      actor = world.place(2, 4, ObjectType.PERSON);
      actor.inventory.add(ResourceType.WOOD, 10);
    });

    it('place resource on give tile', () => {
      const action = new DropItemAction(actor, [ [ 2, 3 ] ], ResourceType.WOOD);
      action.perform();
      const tile = actor.world.getTile(2, 3);
      equal(tile.object.type, ResourceType.WOOD);
    });

  });

});
