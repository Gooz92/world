import World from './World.js';

import { generateArray } from 'utils/array.utils.js';
import { getObject } from 'utils/fn.utils.js';

import { assert } from 'chai';

describe('World', function () {

  let world;

  const W = 12, H = 9;

  beforeEach(() => {
    const tiles = generateArray(H, () => generateArray(W, getObject));
    world = new World(tiles);
  });

  describe('#width', function () {

    it('return width of world', () => {
      assert.strictEqual(world.width, W);
    });

  });

  describe('#height', function () {

    it('return height of world', () => {
      assert.strictEqual(world.height, H);
    });

  })

});
