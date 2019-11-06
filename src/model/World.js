import ObjectType from 'model/ObjectType.enum.js';
import Person from 'model/Person.js'; // TODO ?

import handleCollision from './handle-collision.js';

import { getCycleCoordinate } from 'utils/common/math.utils.js';
import Strategy from './strategies/Strategy.js';
import { time } from 'utils/common/dev.utils';
import { normalizeArea } from 'utils/common/geometry.utils.js';

export default class World {

  constructor(tiles) {
    this.tiles = tiles;
    this.actors = [];
  }

  tick() {

    time('handle-collision', () => {
      handleCollision(this.actors);
    });

    const actions = this.actors
      .map(actor => {
        try {
          return actor.act();
        } catch (e) {
          console.log(e); // TODO ?
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

  $forEachTileInArea(x1, y1, x2, y2, onTile) {
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        const tile = this.tiles[y][x];
        onTile(tile);
      }
    }
  }

  forEachTileInArea(x1, y1, x2, y2, onTile) {
    const dx = Math.abs(x1 - x2), dy = Math.abs(y1 - y2);

    const [ minX, minY, maxX, maxY ] = normalizeArea(x1, y1, x2, y2);

    const hOverflow = dx > this.width / 2, vOverflow = dy > this.height / 2;

    // TODO: refactor somehow
    if (hOverflow && vOverflow) {
      this.$forEachTileInArea(0, 0, minX, minY, onTile);
      this.$forEachTileInArea(maxX, maxY, this.width - 1, this.height - 1, onTile);
      this.$forEachTileInArea(0, maxY, minX, this.height - 1, onTile);
      this.$forEachTileInArea(maxX, 0, this.width - 1, minY, onTile);
    } else if (hOverflow) {
      this.$forEachTileInArea(0, minY, minX, maxY, onTile);
      this.$forEachTileInArea(maxX, minY, this.width - 1, maxY, onTile);
    } else if (vOverflow) {
      this.$forEachTileInArea(minX, 0, maxX, minY, onTile);
      this.$forEachTileInArea(minX, maxY, maxX, this.height - 1, onTile);
    } else {
      this.$forEachTileInArea(minX, minY, maxX, maxY, onTile);
    }
  }

  placeArea(x1, y1, x2, y2, tileProperies) {
    this.forEachTileInArea(x1, y1, x2, y2, tile => {
      Object.assign(tile, tileProperies);
    });
  }

  isTileEmpty(x, y) {
    const tile = this.getTile(x, y);
    return !tile.object;
  }

  isTileOccupiedBy(x, y, type) {
    const tile = this.getTile(x, y);
    return !!tile.object && tile.object.type === type;
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
