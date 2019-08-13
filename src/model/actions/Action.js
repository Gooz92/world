export default class Action {

  static IDLE = class IdleAction extends Action {

    static TYPE = 'idle';

    get type() {
      return IdleAction.TYPE;
    }
  };

  constructor(actor, tiles = []) {
    this.actor = actor;
    this.tiles = tiles;
    this.cost = 1;
    this.completed = false;
  }

  getLeftDuration() {

    const leftDuration = Math.floor(this.cost / this.actor.strength) - this.actor.energy;

    if (leftDuration < 0) {
      return 0;
    }

    return leftDuration;
  }

  perform() {
    this.completed = true;

    return {
      type: this.type,
      actor: this.actor,
      tiles: this.tiles
    };
  }
}
