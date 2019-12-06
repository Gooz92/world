import { nextGeneration, FOOD, TREE, updateFcell } from 'utils/common/ca.js';
import { generateArray } from 'utils/common/array.utils';
import { getFalse } from 'utils/common/fn.utils';
import select from 'views/components/select';

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

  if (tiles[tileY][tileX] === selectedType.id) {
    clearCell(ctx, x, y);
  } else {
    tiles[tileY][tileX] = selectedType.id;
    const cell = tiles[tileY][tileX];
    drawCell(ctx, x, y, cell);
  }
});

function draw(tiles) {
  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[y].length; x++) {
      drawCell(ctx, x * TILE_SIZE, y * TILE_SIZE, tiles[y][x]);
    }
  }
}

const colors = {
  [ FOOD ]: 'grey',
  [ TREE ]: 'green'
};

function drawCell(ctx, x, y, type) {
  const color = colors[type];

  if (color) {
    ctx.fillStyle = colors[type];
    ctx.fillRect(x + 1, y + 1, TILE_SIZE - 1, TILE_SIZE - 1);
  } else {
    ctx.clearRect(x, y, TILE_SIZE, TILE_SIZE);
  }
}

function clearCell(ctx, x, y) {
  ctx.clearRect(x, y, TILE_SIZE, TILE_SIZE);
}

const types = [
  { id: TREE, name: 'tree' },
  { id: FOOD, name: 'food' }
];

let selectedType = types[0];

const typeSelect = select(types, item => {
  selectedType = item;
});

document.body.appendChild(typeSelect.element);

let tID;

document.getElementById('play-button').addEventListener('click', event => {
  tID = setInterval(() => {
    tiles = nextGeneration(tiles, updateFcell, 4);
    draw(tiles);
  }, 200);
});

document.getElementById('stop-button').addEventListener('click', event => {
  clearInterval(tID);
});
