
/**
 * vertical and horisontal moves cost 2 point
 * diaganal cost 3 point
 * 
 *  3 / 2 = 1.5 
 *  sqrt(2) = 1.414
 */

function calculateDistance(x1, y1, x2, y2) {
  const dx = Math.abs(x1 - x2);
  const dy = Math.abs(y1 - y2);

  return 3 * Math.min(dx, dy) + 2 * Math.abs(dx - dy);
}
