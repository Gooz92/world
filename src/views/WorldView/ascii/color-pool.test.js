import { default as colorPool, COLORS } from './color-pool.js';

import { isTrue } from 'utils/common/assertion.js';

describe('colorPool', function () {

  it('return first priority color at first', () => {
    const getColor = colorPool();
    isTrue(COLORS[0].includes(getColor()));
  });

  it('can switch to color with less priority', () => {
    const getColor = colorPool();

    let steps = COLORS[0].length + COLORS[1].length;

    while (steps-- > 0) {
      getColor();
    }

    const color = getColor();

    isTrue(COLORS[2].includes(color));
  });

  it('switch back to first colors if all colors were iterated', () => {
    const getColor = colorPool();

    let colorCounts = COLORS.reduce((count, colors) => count + colors.length, 0);

    while (colorCounts-- > 0) {
      getColor();
    }

    const primaryColor = getColor();

    isTrue(COLORS[0].includes(primaryColor));
  });

});
