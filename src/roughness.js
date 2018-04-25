import { randomInt } from './utils.js';

function roughness(startX, startY, endX, endY, r, n) {
  
  let points = [
    [ startX, startY ],
    [ endX, endY ]
  ];

  while (n-- > 0) {
    const nextPoints = [];
    for (let i = 0; i < points.length - 1; i++) {
      const [ x1, y1 ] = points[i];
      const [ x2, y2 ] = points[i + 1];

      const dx = x2 - x1;
      const dy = y2 - y1;
    
      const dxm = r * dx;
      const dym = -r * dy;
    
      const xm = (x1 + x2) / 2;
      const ym = (y1 + y2) / 2;

      nextPoints.push([ x1, y1 ], [ xm, ym ]);
    }

    points = nextPoints.concat([ points[points.length - 1] ])
  }

  return points;
}
