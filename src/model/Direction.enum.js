import createEnum from 'utils/common/create-enum.js';
import { camelCase } from 'utils/common/string.utils.js';

/*
 * sqrt(2) ~ 1.4 ~ 1.5
 * 10 / 15 = 2 / 3
 * 10 / 14 = 5 / 7 would be better approximation
 */

const AXIAL_TILE_DISTANCE = 2;

const DIAGONAL_TILE_DISTANCE = 3;

const isDiagonal = (dx, dy) => (
  Math.abs(dx) > 0 && Math.abs(dy) > 0
);

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

    this.name = camelCase(key);

    this.isDiagonal = isDiagonal(dx, dy);

    this.distance = this.isDiagonal ? DIAGONAL_TILE_DISTANCE : AXIAL_TILE_DISTANCE;
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

Direction.axial = Direction.members.filter(direction => !direction.isDiagonal);

Direction.diagonal = Direction.members.filter(direction => direction.isDiagonal);

Direction.fromPoints = ([ x0, y0 ], [ x1, y1 ]) => {
  const dx = Math.sign(x1 - x0), dy = Math.sign(y1 - y0);

  return Direction.members.find(direction => (
    direction.dx === dx && direction.dy === dy
  ));
};

Direction.fromOffset = (dx, dy) => (
  Direction.members.find(member => dx === member.dx && dy === member.dy) || null
);

Direction.prototype.getOpposite = function () {
  return Direction.fromOffset(-this.dx, -this.dy);
};

Direction.prototype.isOpposite = function (direction) {
  return this.getOpposite() === direction;
};

export default Direction;
