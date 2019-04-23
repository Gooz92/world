import createEnum from 'utils/common/create-enum.js';

/*
 * sqrt(2) ~ 1.4 ~ 1.5
 * 10 / 15 = 2 / 3
 * 10 / 14 = 5 / 7 would be better approximation
 */

const AXIAL_TILE_DISTANCE = 2;

const DIAGONAL_TILE_DISTANCE = 3;

/*
 * -1         0           1
 *          North
 *
 *        nw  n  ne
 *          \ | /
 * 0 West  w - @ - e  East
 *          / | \
 *        sw  s  se
 *
 * 1        South
 */

const Direction = createEnum(
  function (dx, dy, key) {
    this.dx = dx;
    this.dy = dy;

    this.name = key
      .split('_')
      .map(word => word.charAt(0).toLowerCase())
      .join('');

    const isDiagonal = Math.abs(dx) > 0 && Math.abs(dy) > 0;

    this.isDiagonal = isDiagonal;

    this.distance = isDiagonal ? DIAGONAL_TILE_DISTANCE : AXIAL_TILE_DISTANCE;
  },
  {
    NORTH: [ 0, -1 ],
    NORTH_EAST: [ 1, -1 ],
    EAST: [ 1, 0 ],
    SOUTH_EAST: [ 1, 1 ],
    SOUTH: [ 0, 1 ],
    SOUTH_WEST: [ -1, 1 ],
    WEST: [ -1, 0 ],
    NORTH_WEST: [ -1, -1 ]
  }
);

export default Direction;
