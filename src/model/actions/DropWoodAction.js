import Action from './Action.js';
import ResourceType from 'model/ResourceType.enum.js';

export default class DropWoodAction extends Action {

  perform() {
    this.actor.inventory.remove(ResourceType.WOOD);
    return super.perform();
  }
}
