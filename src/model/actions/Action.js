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
    this.duration = 1;
    this.completed = false;
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
