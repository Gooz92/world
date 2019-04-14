import ObjectType from './ObjectType.js';
import Person from 'model/Person.js';

import { getCycleCoordinate } from 'utils/common/math.utils.js';

export default class World {

  constructor(tiles, actors = []) {
    this.tiles = tiles;
    this.actors = actors;
  }

  tick() {
    return this.actors
      .map(actor => actor.act());
  }

  // TODO: get rid of this in future =)
  placePerson(x, y) {
    const person = new Person(this.tiles, [ x, y ]);
    this.tiles[y][x].object = person;
    this.actors.push(person);

    return person;
  }

  place(x, y, type) {
    if (type === ObjectType.PERSON) {
      return this.placePerson(x, y);
    }

    const object = { type };
    this.tiles[y][x].object = object;

    return object;
  }

  getTile(x, y) {
    const x0 = this.getCycleX(x);
    const y0 = this.getCycleY(y);

    return this.tiles[y0][x0];
  }

  getCycleX(x) {
    return getCycleCoordinate(x, this.tiles[0].length);
  }

  getCycleY(y) {
    return getCycleCoordinate(y, this.tiles.length);
  }

  get width() {
    return this.tiles[0].length;
  }

  get height() {
    return this.tiles.length;
  }
}
