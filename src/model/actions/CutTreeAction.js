import Action from './Action.js';

export default class CutTreeAction extends Action {

  constructor(actor, treePosition) {
    super(actor, [ treePosition ]);
    this.duration = 1; // TODO
  }

  perform() {
    const [ [ x, y ] ] = this.tiles;
    this.actor.world[y][x].object = null;
    return super.perform();
  }
}
