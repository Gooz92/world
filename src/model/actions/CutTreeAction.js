import Action from './Action.js';
import ResourceType from 'model/ResourceType.enum.js';

export default class CutTreeAction extends Action {

  constructor(actor, treePosition) {
    super(actor, [ treePosition ]);
    this.cost = 3;
  }

  perform() {
    const [ [ x, y ] ] = this.tiles;

    /*
     * TODO: there is a bug in CutTreeStrategy and actor sometimes
     * try to cut non existing tree
     */
    const tree = this.actor.world.getObject(x, y);

    tree.amount--;
    this.actor.pickUp(ResourceType.WOOD, 2);

    if (tree.amount === 0) {
      this.actor.world.clearTile(x, y);
    }

    return super.perform();
  }
}
