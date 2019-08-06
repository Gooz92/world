import Action from './Action.js';

export default class MoveAction extends Action {

  constructor(actor, direction, destination) {
    super(actor, [ actor.position, destination ]);

    this.direction = direction;
    this.duration = direction.distance;
  }

  get destination() {
    return this.tiles[1];
  }

  perform() {
    this.actor.moveTo(this.destination);
    return super.perform();
  }
}
