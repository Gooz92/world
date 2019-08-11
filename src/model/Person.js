import ObjectType from 'model/ObjectType.enum.js';
import Actor from './Actor.js';

let count = 0;

export default class Person extends Actor {

  constructor(world, position) {
    super(world);
    this.position = position;
    this.name = `person-${count++}`;
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
