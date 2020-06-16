import State from './State.js';
import ObjectType from 'model/ObjectType.enum.js';
import CutTreeAction from 'model/actions/CutTreeAction.js';
import ResourceType from 'model/ResourceType.enum.js';

export default class CutTreeState extends State {

  constructor(actor, { treePosition }) {
    super(actor);
    this.treePosition = treePosition;
  }

  nextAction() {
    const [ x, y ] = this.treePosition;

    const { object } = this.actor.world.getTile(x, y);

    if (!object || object.type !== ObjectType.TREE) {
      return null;
    }

    return new CutTreeAction(this.actor, this.treePosition);
  }

  isDone() {
    return this.actor.inventory.getAmount(ResourceType.WOOD) >= 10;
  }
}
