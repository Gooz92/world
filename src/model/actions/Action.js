export default class Action {

  static IDLE = new class IdleAction extends Action {};

  constructor(actor = {}, tiles = []) {
    this.actor = actor;
    this.tiles = tiles;
    this.duration = 1;
    this.completed = false;
  }

  perform() {
    this.completed = true;
    return { tiles: this.tiles };
  }
}
