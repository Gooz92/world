import Action from './Action.js';

export default class CutTreeAction extends Action {

  static type = 'CUT_TREE';

  static duration = 1;

  constructor(actor, treeTile, treePosition) {
    super(actor, { treeTile, treePosition });
  }

  perform() {
    this.data.treeTile.object = null;
    return super.perform();
  }
}
