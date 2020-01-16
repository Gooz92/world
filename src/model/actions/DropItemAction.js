import Action from './Action.js';

export default class DropItemAction extends Action {

  constructor(actor, tiles, itemType) {
    super(actor, tiles);
    this.itemType = itemType;
  }

  perform() {
    const amount = this.actor.inventory.getAmount(this.itemType);
    this.actor.inventory.remove(this.itemType);

    const [ x, y ] = this.tiles[0];
    this.actor.world.placeResource(x, y, this.itemType, amount);
    return super.perform();
  }
}
