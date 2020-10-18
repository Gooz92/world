import { equal, notEqual } from 'utils/assertion.js';
import ObjectType from 'model/ObjectType.enum.js';
import { createEmptyWorld } from './World.test-utils.js';

describe('World', function () {

  let world;

  const W = 12, H = 9;

  beforeEach(() => {
    world = createEmptyWorld(W, H);
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

  // TODO ?
  describe('#placeArea', function () {

    it('change tiles in defiend area', () => {
      const x = 2, y = 3, width = 2, height = 3;
      const maxX = x + width - 1, maxY = y + height - 1;

      world.placeArea(x, y, width, height, { terrain: ObjectType.STOCK });

      [ [ x, y ],[ maxX, maxY ] ].forEach(([ x, y ]) => {
        const tile = world.getTile(x, y);
        equal(tile.terrain, ObjectType.STOCK);
      });

    });

    it('works with overflows by horizontal', () => {
      const x0 = W - 3, y0 = 2, width = 5, height = 3;

      const x2 = 1, y2 = y0 + height - 1;

      world.placeArea(x0, y0, width, height, { terrain: ObjectType.STOCK });

      [ [ x0, y0 ], [ x2, y2 ] ].forEach(([ x, y ]) => {
        const tile = world.getTile(x, y);
        equal(tile.terrain, ObjectType.STOCK);
      });

      [ [ x0 - 1, y0 ], [ x2 + 1, y2 + 2 ] ].forEach(([ x, y ]) => {
        const tile = world.getTile(x, y);
        notEqual(tile.terrain, ObjectType.STOCK);
      });
    });

    it('works with overflows by vertical', () => {
      const x1 = 3, y1 = H - 2;
      const width = -3, height = 5;
      const x2 = 1, y2 = 2;

      world.placeArea(x1, y1, width, height, { terrain: ObjectType.STOCK });

      [ [ x1, y1 ], [ x2, y2 ] ].forEach(([ x, y ]) => {
        const tile = world.getTile(x, y);
        equal(tile.terrain, ObjectType.STOCK);
      });

      [ [ x1 + 1, y1 ], [ x2, y2 + 2 ] ].forEach(([ x, y ]) => {
        const tile = world.getTile(x, y);
        notEqual(tile.terrain, ObjectType.STOCK);
      });
    });

    it('works with overflows by vertical and horizontal', () => {
      const x1 = W - 1, y1 = H - 2;
      const width = 4, height = 4;
      const x2 = 2, y2 = 1;

      world.placeArea(x1, y1, width, height, { terrain: ObjectType.STOCK });

      [ [ x1, y1 ], [ x2, y2 ], [ 0, 0 ] ].forEach(([ x, y ]) => {
        const tile = world.getTile(x, y);
        equal(tile.terrain, ObjectType.STOCK);
      });

      [ [ x1 - 1, y1 - 1 ], [ x2, y2 + 2 ] ].forEach(([ x, y ]) => {
        const tile = world.getTile(x, y);
        notEqual(tile.terrain, ObjectType.STOCK);
      });
    });
  });

  describe('#place', function () {

    const x = 2, y = 4, type = { name: 'thing' };

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
