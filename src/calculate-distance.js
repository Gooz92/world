import{ AXIAL_TILE_DISTACE, DIAGONAL_TILE_DISTANCE } from './model/consts.js';

export default function (x1, y1, x2, y2) {
  const dx = Math.abs(x1 - x2);
  const dy = Math.abs(y1 - y2);

  return (
    DIAGONAL_TILE_DISTANCE * Math.min(dx, dy) +
    AXIAL_TILE_DISTACE * Math.abs(dx - dy)
  );
}
