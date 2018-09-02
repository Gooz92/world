import Action from './Action.js';

export default class CutTreeAction extends Action {

  static type = 'CUT_TREE';

  constructor(actor, treeTile, treePosition) {
    super(actor, { treeTile, treePosition });
    this.duration = 1; // TODO
  }

  perform() {
    this.data.treeTile.object = null;
    return super.perform();
  }
}
