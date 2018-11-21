import { getZero } from 'utils/fn.utils.js';

/**
 * <direction-name> : () => [
 *  getCellCoordinates(): [ x, y ],
 *  getReferenceIndex,
 *  side
 * ]
 */

export const insertionOptions = {
  up: (x, y, width) => [

    /**
     * Cells append before first cell.
     * So, rightmost cell creates firstly
     */

    (i, j) => [ x + width - j - 1, y - 1 - i ],
    getZero,
    width
  ],

  down: (x, y, width, height) => [
    (i, j) => [ x + j, y + height + i ],
    () => -1,
    width
  ],

  left: (x, y, width, height, shift) => [
    (i, j) => [ x - 1, y + j ],
    (i, j) => j * (width + i - shift + 1),
    height
  ],

  right: (x, y, width, height, shift) => [
    (i, j) => [ x + i + width, y + j ],
    (i, j) => (width + i - shift) * (j + 1) + j,
    height
  ]
};

/**
 * {
 *  <direction-name> : (width, height) => [
 *    getRemovementIndex,
 *    side, // width for up and down, height for left and right
 *    decreasedSide // height if side is width and vice versta
 *  ]
 * }
 */

export const removementOptions = {
  up: (width, height) => [
    getZero,
    width, height
  ],

  down: (width, height) => [
    (i, h) => width * h - i - 1,
    width, height
  ],

  /**
   * Width is decreasing after column removing.
   * Actual value of width passed as second argument of
   * `getRemovementIndex` function
   */

  left: (width, height) => [
    // index of first cell in row
    (i, w) => i * (w - 1),
    height, width
  ],

  right: (width, height) => [
    // index of last cell in row
    (i, w) => (w - 1) * (i + 1),
    height, width
  ]
};
