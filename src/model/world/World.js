import ObjectType from 'model/ObjectType.enum.js';

// import handleCollision from './handle-collision.js';

import { getCycleCoordinate } from 'utils/common/math.utils.js';
import { get } from 'utils/common/object.utils.js';
import { upperFirst } from 'utils/common/string.utils.js';
import Person from '../Person.js';

/*
 * tile { object, terrain, area }
 */

class ObjectPlacer {

  static PLACE_METHOD_NAME_PREFIX = 'place';

  static getPlaceMethodName(type) {
    return ObjectPlacer.PLACE_METHOD_NAME_PREFIX + upperFirst(type.name);
  }

  constructor(world) {
    this.world = world;
  }

  placePerson(x, y) {
    const person = new Person(this.world, [ x, y ]);
    this.world.tiles[y][x].object = person;
    this.world.actors.push(person);

    return person;
  }

  placeTree(x, y, type) {
    const tree = this.$place(x, y, type);
    tree.amount = 10;
    return tree;
  }

  $place(x, y, type) {
    const object = { type };
    this.world.tiles[y][x].object = object;
    return object;
  }

  placeResource(x, y, type, amount) {
    const tile = this.world.getTile(x, y);

    if (!tile.object || tile.object.type !== type) {
      tile.object = { type, amount: 0 };
    }

    tile.object.amount += amount;

    return tile.object;
  }

  place(x, y, type) {
    const methodName = ObjectPlacer.getPlaceMethodName(type);
    const method = this[methodName];

    if (method) {
      return method.call(this, x, y, type);
    }

    return this.$place(x, y, type);
  }
}

export default class World {

  constructor(tiles) {
    this.tiles = tiles;
    this.actors = [];

    this.objectPlacer = new ObjectPlacer(this);
  }

  tick() {

    // handleCollision(this.actors);

    const actions = this.actors
      .map(actor => {
        try {
          return actor.act();
        } catch (e) {
          console.log(e); // TODO ?
        }

        // return actor.idle();
      }).filter(action => !!action); // ?

    return actions;
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

  placeResource(x, y, type, amount) {
    return this.objectPlacer.placeResource(x, y, type, amount);
  }

  place(x, y, type) {
    return this.objectPlacer.place(x, y, type);
  }

  placeMultiple(positions, type) {
    return positions.map(([ x, y ]) => (
      this.objectPlacer.place(x, y, type)
    ));
  }

  placeBuilding(Building, x, y) {
    const { WIDTH, HEIGHT } = Building;
    const building = new Building(x, y);
    this.placeArea(x, y, WIDTH, HEIGHT, { object: building });
    return building;
  }

  getAreaTiles(x, y, width, height) {
    const tiles = [];

    this.forEachTileInArea(x, y, width, height, tile => {
      tiles.push(tile);
    });

    return tiles;
  }

  forEachTileInArea(x0, y0, width, height, onTile) {
    const endX = x0 + width, endY = y0 + height;
    const dx = Math.sign(width), dy = Math.sign(height);

    for (let y = y0; y !== endY; y += dy) {
      for (let x = x0; x !== endX; x += dx) {
        const tile = this.getTile(x, y);
        onTile(tile);
      }
    }
  }

  isAreaPlaceable(x, y, width, height) {
    const tiles = this.getAreaTiles(x, y, width, height);
    return tiles.every(tile => !tile.object && !tile.terrain);
  }

  placeArea(x, y, width, height, tileProperies) {
    const area = { x, y, width, height };

    this.forEachTileInArea(x, y, width, height, tile => {
      Object.assign(tile, { ...tileProperies, area });
    });
  }

  isTileEmpty(x, y) {
    return !this.getObject(x, y);
  }

  isTileOccupiedBy(x, y, type) {
    const tile = this.getTile(x, y);
    return !!tile.object && tile.object.type === type;
  }

  isTileOccupied(x, y) {
    return !this.isTileEmpty(x, y);
  }

  getObject(x, y) {
    const tile = this.getTile(x, y);
    return tile.object || null;
  }

  isTilePassable(x, y) {
    const object = this.getObject(x, y);
    return object === null || object.type === ObjectType.PERSON;
  }

  getTileType(x, y) {
    const tile = this.getTile(x, y);
    return get(tile, 'object.type');
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
