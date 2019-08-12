import Action from './Action.js';

export default class MoveAction extends Action {

  static TYPE = 'move';

  constructor(actor, direction, destination) {
    super(actor, [ actor.position, destination ]);

    this.direction = direction;
    this.duration = direction.distance;
  }

  get type() {
    return MoveAction.TYPE;
  }

  get destination() {
    return this.tiles[1];
  }

  perform() {
    this.actor.moveTo(this.destination);
    return super.perform();
  }
}
