import ObjectType from 'model/ObjectType.enum.js';
import Person from 'model/Person.js'; // TODO ?
import collisionHandler from './collision-handler.js';

import { getCycleCoordinate } from 'utils/common/math.utils.js';

export default class World {

  constructor(tiles) {
    this.tiles = tiles;

    this.actors = [];
    this.strategies = [];

    this.collisionHandler = collisionHandler; // TODO ?
  }

  onSetWalkStrategy(strategy) {
    this.collisionHandler.addWalker(strategy.actor);
  }

  onRemoveWalkStrategy(strategy) {
    this.collisionHandler.removeWalker(strategy.actor);
  }

  tick() {

    this.collisionHandler.tick();

    const actions = this.actors
      .map(actor => actor.act());

    return actions;
  }

  // TODO: get rid of this in future =)
  placePerson(x, y) {
    const person = new Person(this, [ x, y ]);
    this.tiles[y][x].object = person;
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

  isTileOccupied(x, y) {
    const tile = this.getTile(x, y);

    return !!tile.object;
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
