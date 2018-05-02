import { roughness } from './roughness.js';

const points = roughness(200, 100, 200, 300, 0.2, 6);

document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('canv').getContext('2d');

  let [ x, y ] = points[0];
  ctx.moveTo(x, y);

  for (let i = 1; i < points.length; i++) {
    [ x, y ] = points[i];
    ctx.lineTo(x, y);
  }

  ctx.stroke();

});
