import State from './State.js';
import DropItemAction from 'model/actions/DropItemAction.js';

export default class DropResourceState extends State {

  constructor(actor, { targetPosition, resourceType }) {
    super(actor);

    this.targetPosition = targetPosition;
    this.resourceType = resourceType;
  }

  nextAction() {
    return new DropItemAction(this.actor, [ this.targetPosition ], this.resourceType);
  }

  isDone() {
    return !this.actor.inventory.contains(this.resourceType);
  }
}
