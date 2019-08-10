import World from './World.js';

import { generateArray } from 'utils/common/array.utils.js';
import { getObject } from 'utils/common/fn.utils.js';

import { equal } from 'utils/common/assertion.js';
import ObjectType from 'model/ObjectType.enum.js';
import Strategy from './strategies/Strategy.js';

describe('World', function () {

  let world;

  const W = 12, H = 9;

  beforeEach(() => {
    const tiles = generateArray(H, W, getObject);
    world = new World(tiles);
  });

  describe('#addStrategy', function () {

    it('push strategy in strategies array', () => {
      world.addStrategy(Strategy);
      equal(world.strategies[0], Strategy);
    });

  });

  describe('#width', function () {

    it('return width of world', () => {
      equal(world.width, W);
    });

  });

  describe('#height', function () {

    it('return height of world', () => {
      equal(world.height, H);
    });

  });

  describe('#place', function () {

    const x = 2, y = 4, type = 'thing';

    const place = () => {
      return world.place(x, y, type);
    };

    it('return placed object', () => {
      const object = place();
      equal(object.type, type);
    });

    it('place object on tile', () => {
      place();
      const tile = world.getTile(x, y);
      equal(tile.object.type, type);
    });

  });

  describe('#clearTile', function () {

    it('remove object from tile', () => {
      const x = 2, y = 4;
      world.place(x, y, ObjectType.TREE);
      world.clearTile(x, y);

      equal(world.getTile(x, y).object, null);
    });
  });

});
