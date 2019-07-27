import World from './World.js';

import { generateArray } from 'utils/common/array.utils.js';
import { getObject } from 'utils/common/fn.utils.js';

import { equal, isFalse, isTrue } from 'utils/common/assertion.js';
import ObjectType from './ObjectType.js';

describe('World', function () {

  let world;

  const W = 12, H = 9;

  beforeEach(() => {
    const tiles = generateArray(H, W, getObject);
    world = new World(tiles);
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

  describe('isSelectionMoved()', function () {

    let world;

    beforeEach(() => {
      const tiles = generateArray(H, W, getObject);
      world = new World(tiles);
    });

    it('return false if there is no selection', () => {
      isFalse(world.isSelectionMoved());
    });

    it('return false if selected object has no position (can not moved)', () => {
      const x = 2, y = 3;
      world.place(x, y, 'stone');
      world.select(x, y);

      isFalse(world.isSelectionMoved());
    });

    it('return true if selected object is moved', () => {
      const x = 3, y = 2;
      const walker = world.place(x, y, ObjectType.PERSON);
      world.select(x, y);
      walker.moveTo([ x + 1, y - 1 ]);

      isTrue(world.isSelectionMoved());
    });

    it('return false if selected object is moved', () => {
      const x = 1, y = 2;
      world.place(x, y, ObjectType.PERSON);
      world.select(x, y);

      isFalse(world.isSelectionMoved());
    });

  });

  describe('select', function () {

    it('store selected object in "selected" field', () => {
      const tiles = generateArray(12, 8, getObject);
      const world = new World(tiles);
      const thing = world.place(2, 1, 'thing');

      world.select(2, 1);

      equal(world.selected.object, thing);
    });

    it('return selected obejct', () => {
      const tiles = generateArray(12, 8, getObject);
      const world = new World(tiles);
      const thing = world.place(2, 1, 'thing');

      equal(world.select(2, 1).object, thing);
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
