import Strategy from './Strategy.js';

import DropItemAction from 'model/actions/DropItemAction.js';

export default class DropItemStrategy extends Strategy {

  constructor(actor, { position, resourceType, nextStrategy }) {
    super(actor);

    this.position = position;
    this.resourceType = resourceType;

    this.$nextStrategy = nextStrategy;
  }

  nextAction() {
    return new DropItemAction(this.actor, [ this.position ], this.resourceType);
  }

  nextStrategy() {
    if (this.action && this.action.completed) {
      return { Strategy: this.$nextStrategy };
    }

    return null;
  }
}
