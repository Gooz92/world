import { nextGeneration } from 'utils/common/ca.js';
import { generateArray } from 'utils/common/array.utils';
import { getFalse, identity } from 'utils/common/fn.utils';

const canvas = document.getElementById('canv'),
  ctx = canvas.getContext('2d');

const { left: x0, top: y0 } = canvas.getBoundingClientRect();

const TILE_SIZE = 10;

const width = canvas.width / TILE_SIZE,
  height = canvas.height / TILE_SIZE;

let tiles = generateArray(height, width, getFalse);

canvas.addEventListener('click', event => {
  const tileX = Math.floor((event.clientX - x0) / TILE_SIZE),
    tileY = Math.floor((event.clientY - y0) / TILE_SIZE);

  const x = tileX * TILE_SIZE, y = tileY * TILE_SIZE;

  tiles[tileY][tileX] = !tiles[tileY][tileX];

  if (tiles[tileY][tileX]) {
    drawCell(ctx, x, y);
  } else {
    clearCell(ctx, x, y);
  }
});

function draw(tiles) {
  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[y].length; x++) {
      if (tiles[y][x]) {
        drawCell(ctx, x * TILE_SIZE, y * TILE_SIZE);
      } else {
        clearCell(ctx, x * TILE_SIZE, y * TILE_SIZE);
      }
    }
  }
}

function drawCell(ctx, x, y) {
  ctx.fillRect(x + 1, y + 1, TILE_SIZE - 1, TILE_SIZE - 1);
}

function clearCell(ctx, x, y) {
  ctx.clearRect(x, y, TILE_SIZE, TILE_SIZE);
}

function updateCell(cell, neighbors) {
  const [ n1, n2 ] = neighbors;
  const n = [ ...n1, ...n2 ];
  const count = n.filter(identity).length;
  if (count === 3) {
    return true;
  }

  if (cell && [ 2, 3 ].includes(count)) {
    return true;
  }

  return false;
}

let tID;

document.getElementById('play-button').addEventListener('click', event => {
  tID = setInterval(() => {
    tiles = nextGeneration(tiles, updateCell, 2);
    draw(tiles);
  }, 200);
});

document.getElementById('stop-button').addEventListener('click', event => {
  clearInterval(tID);
});
