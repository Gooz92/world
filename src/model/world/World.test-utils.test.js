import { createEmptyWorld } from './World.test-utils.js';
import { equal, isTrue } from 'utils/common/assertion.js';

describe('World test utils', function () {

  describe('createEmptyWorld', function () {

    it('create world with given size', () => {
      const width = 640, height = 480;
      const world = createEmptyWorld(width, height);

      equal(world.width, width);
      equal(world.height, height);
    });

    it('create empty world', () => {
      const width = 128, height = 64;
      const world = createEmptyWorld(width, height);

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          isTrue(world.isTileEmpty(x, y));
        }
      }
    });

  });

});
