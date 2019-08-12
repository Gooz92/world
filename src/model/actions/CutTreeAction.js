import Action from './Action.js';

export default class CutTreeAction extends Action {

  constructor(actor, treePosition) {
    super(actor, [ treePosition ]);
    this.duration = 1; // TODO
  }

  perform() {
    const [ [ x, y ] ] = this.tiles;

    /*
     * TODO: there is a bug in CutTreeStrategy and actor sometimes
     * try to cut tree non existing tree
     */

    this.actor.world.clearTile(x, y);
    return super.perform();
  }

  get type() {
    return 'cut-tree';
  }
}
