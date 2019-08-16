import ObjectType from 'model/ObjectType.enum.js';
import Person from 'model/Person.js'; // TODO ?

import handleCollision from './handle-collision.js/';

import { getCycleCoordinate } from 'utils/common/math.utils.js';
import Strategy from './strategies/Strategy.js';

export default class World {

  constructor(tiles) {
    this.tiles = tiles;
    this.actors = [];
  }

  tick() {

    try {
      handleCollision(this.actors);
    } catch (e) {
      console.log(e);
    }

    const actions = this.actors
      .map(actor => {
        try {
          return actor.act();
        } catch (e) {
          console.log(e);
        }

        return actor.idle();
      });

    return actions;
  }

  // TODO: get rid of this in future =)
  placePerson(x, y) {
    const person = new Person(this, [ x, y ]);
    this.tiles[y][x].object = person;
    person.setStrategy(Strategy.IDLE);
    this.actors.push(person);

    return person;
  }

  removeActor(actor) {
    this.actors = this.actors.filter(a => a !== actor);
  }

  clearTile(x, y) {
    const object = this.tiles[y][x].object;

    if (object && object.type === ObjectType.PERSON) {
      this.removeActor(object);
    }

    this.tiles[y][x].object = null;
  }

  place(x, y, type) {
    if (type === ObjectType.PERSON) {
      return this.placePerson(x, y);
    }

    const object = { type };
    this.tiles[y][x].object = object;

    return object;
  }

  isTileEmpty(x, y) {
    const tile = this.getTile(x, y);
    return !tile.object;
  }

  isTileOccupied(x, y) {
    return !this.isTileEmpty(x, y);
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
