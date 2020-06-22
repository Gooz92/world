import ObjectType from 'model/ObjectType.enum.js';
import Actor from './Actor.js';
import Inventory from './Inventory.js';
import WalkState from './behavior/WalkState.js';

let count = 0;

export default class Person extends Actor {

  constructor(world, position) {
    super(world);
    this.position = position;
    this.name = `person-${count++}`;
    this.inventory = new Inventory(10);
  }

  pickUp(resourceType, amount) {
    return this.inventory.add(resourceType, amount);
  }

  canMoveTo(x, y) {
    return !this.world.isTileOccupied(x, y);
  }

  isMoving() {
    const state = this.getState();
    return state.constructor === WalkState && !state.isDone();
  }

  moveTo(position) {
    const [ x1, y1 ] = this.position;
    const [ x2, y2 ] = position;

    this.world.getTile(x1, y1).object = null;

    const nextTile = this.world.getTile(x2, y2);
    nextTile.object = this;

    this.position = position;
  }

  get type() {
    return ObjectType.PERSON;
  }
}
