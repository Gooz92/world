export function clearRenderer(ctx, x, y, size) {
  ctx.clearRect(x, y, size, size);
}

function createColorRenderer(color) {
  return (ctx, x, y, size) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
  };
}

const _2PI = 2 * Math.PI;

export function personRenderer(ctx, x, y, size) {
  const half = size / 2;
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(x + half, y + half, half, 0, _2PI);
  ctx.closePath();
  ctx.fill();
}

export function treeRenderer(ctx, x, y, size) {
  ctx.fillStyle = 'green';
  ctx.beginPath();
  ctx.moveTo(x + size / 2, y);
  ctx.lineTo(x + size, y + size);
  ctx.lineTo(x, y + size);
  ctx.closePath();
  ctx.fill();
}

export const redRenderer = createColorRenderer('red');

export const blueRenderer = createColorRenderer('blue');

export const greyRenderer = createColorRenderer('grey');
