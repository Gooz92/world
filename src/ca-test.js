import { nextGeneration, updateFcell } from 'utils/ca.js';
import { generateArray } from 'utils/common/array.utils.js';
import { getObject } from 'utils/common/fn.utils.js';
import select from 'views/components/select';
import diamondSquareGenerator from 'utils/DiamondSquareGenerator.js';
import createCanvas from 'views/components/canvas';
import { get } from 'utils/common/object.utils.js';
import ObjectType from 'model/ObjectType.enum.js';

const TILE_SIZE = 16;

const generator = diamondSquareGenerator()
  .setCellSize(16)
  .setRows(3)
  .setCols(4)
  .build();

const { width: W, height: H } = generator.size;

const width = W * TILE_SIZE,
  height = H * TILE_SIZE;

const { element: canvas } = createCanvas(width, height),
  ctx = canvas.getContext('2d');

document.body.appendChild(canvas);

const { left: x0, top: y0 } = canvas.getBoundingClientRect();

let tiles = generateArray(H, W, getObject);

canvas.addEventListener('click', event => {
  const tileX = Math.floor((event.clientX - x0) / TILE_SIZE),
    tileY = Math.floor((event.clientY - y0) / TILE_SIZE);

  const x = tileX * TILE_SIZE, y = tileY * TILE_SIZE;

  if (get(tiles[tileY][tileX], 'object.type') === selectedType.type) {
    clearCell(ctx, x, y);
  } else {
    Object.assign(tiles[tileY][tileX], { object: { type: selectedType.type } } );
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
  [ ObjectType.FOOD.name ]: 'grey',
  [ ObjectType.TREE.name ]: 'green'
};

function drawCell(ctx, x, y, cell) {
  const type = get(cell, 'object.type.name');
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
  { id: ObjectType.TREE.id, name: 'tree', type: ObjectType.TREE },
  { id: ObjectType.FOOD.id, name: 'food', type: ObjectType.FOOD }
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
