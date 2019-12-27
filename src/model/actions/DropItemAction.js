import Action from './Action.js';

export default class DropItemAction extends Action {

  constructor(actor, tiles, itemType) {
    super(actor, tiles);
    this.itemType = itemType;
  }

  perform() {
    this.actor.inventory.remove(this.itemType);
    const [ x, y ] = this.tiles[0];
    this.actor.world.place(x, y, this.itemType);
    return super.perform();
  }
}
