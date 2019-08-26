import Action from './Action.js';
import Direction from 'model/Direction.enum.js';

export default class MoveAction extends Action {

  static TYPE = 'move';

  constructor(actor, destination) {
    super(actor, [ actor.position, destination ]);

    this.direction = Direction.fromPoints(actor.position, destination);

    if (!this.direction) {
      console.warn(
        `Wrong move for actor at position [${actor.position}] to [${destination}]`
      );
    }

    this.cost = this.direction.distance;
  }

  get type() {
    return MoveAction.TYPE;
  }

  get destination() {
    return this.tiles[1];
  }

  canPerform() {
    if (!super.canPerform()) {
      return false;
    }

    const [ x, y ] = this.destination;
    return this.actor.canMoveTo(x, y);
  }

  perform() {
    this.actor.moveTo(this.destination);
    return super.perform();
  }
}
