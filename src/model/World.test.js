import World from './World.js';

import { generateArray } from 'utils/common/array.utils.js';
import { getObject } from 'utils/common/fn.utils.js';

import { equal } from 'utils/common/assertion.js';

describe('World', function () {

  let world;

  const W = 12, H = 9;

  beforeEach(() => {
    const tiles = generateArray(H, () => generateArray(W, getObject));
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

    it('return placed object', () => {
      const type = 'thing';
      const object = world.place(1, 2, type);
      equal(object.type, type);
    });

  });

});
