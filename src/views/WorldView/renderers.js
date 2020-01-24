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

export function selectionRenderer(ctx, x, y, size) {
  ctx.strokeStyle = 'blue';
  ctx.strokeRect(x + 1, y + 1, size - 2, size - 2);
}

export const redRenderer = createColorRenderer('red');

export const blueRenderer = createColorRenderer('blue');

export const greyRenderer = createColorRenderer('grey');

export const brownRenderer = createColorRenderer('#964B00');

export const yellowRenderer = createColorRenderer('#FF0');

export const greenRenderer = createColorRenderer('#6daa2c');

export function stockRenderer(ctx, x, y, size) {
  greyRenderer(ctx, x, y, size);
  ctx.strokeStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(x + size * .2, y + size * .8);
  ctx.lineTo(x + size * .8, y + size * .8);
  ctx.stroke();
  ctx.closePath();
}

function createRectangleRenderer(fillStyle) {
  return (ctx, x, y, width, height) => {
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.fillRect(x, y, width, height);
    ctx.closePath();
  };
}

export const renderPlacementArea = createRectangleRenderer('rgba(255, 255, 0, 0.5)');

export const renderRedArea = createRectangleRenderer('rgba(255, 0, 0, 0.5)');

export const renderGreenMask = createRectangleRenderer('rgba(255, 255, 0, 0.5)');
