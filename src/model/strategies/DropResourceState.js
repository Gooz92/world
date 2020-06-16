import State from './State.js';
import DropItemAction from 'model/actions/DropItemAction.js';

export default class DropResourceState extends State {

  constructor(actor, { position, resourceType }) {
    super(actor);

    this.position = position;
    this.resourceType = resourceType;
  }

  nextAction() {
    return new DropItemAction(this.actor, [ this.position ], this.resourceType);
  }
}
