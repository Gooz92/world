import { last, generateArray } from 'utils/array.utils.js';
import { getZero } from 'utils/fn.utils.js';

function findMax(arr) {
  let max = arr[0][0];

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] > max) max = arr[i][j];
    }
  }

  return max;
}

function normalize(arr, n = 1) {
  const max = findMax(arr);

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = Math.round(arr[i][j] / max * n);
    }
  }
}

function inflate(arr, generateItem = getZero) {
  const inflated = [];

  for (let i = 0; i < arr.length - 1; i++) {
    inflated.push(arr[i], generateItem(i));
  }

  inflated.push(last(arr));

  return inflated;
}

function inflate2(arr) {
  const inflated = [];

  for (let i = 0; i < arr.length; i++) {
    inflated.push(inflate(arr[i]));
  }

  return inflate(inflated, i => generateArray(inflated[i].length, getZero));
}

function diamond(arr) {

  for (let i = 1; i < arr.length; i += 2) {
    for (let j = 1; j < arr[i].length; j += 2) {
      arr[i][j] = [
        [ i - 1, j - 1 ],
        [ i - 1, j + 1 ],
        [ i + 1, j - 1 ],
        [ i + 1, j + 1 ]
      ]
        .map(([ i0, j0 ]) => arr[i0][j0])
        .reduce((sum, item) => sum + item, 0) / 4;
    }
  }
}

function square(arr) {

  const firstRow = arr[0];
  const lastRow = last(arr);

  for (let i = 1; i < firstRow.length; i += 2) {
    firstRow[i] = (firstRow[i - 1] + firstRow[i + 1] + arr[1][i]) / 4 + (lastRow[i - 1] + lastRow[i + 1]) / 8;
  }

  for (let i = 1; i < lastRow.length; i += 2) {
    lastRow[i] = (lastRow[i - 1] + lastRow[i + 1] + arr[arr.length - 2][i]) / 4 + (firstRow[i - 1] + firstRow[i + 1]) / 8;
  }

  for (let i = 1; i < arr.length; i += 2) {
    arr[i][0] = (arr[i - 1][0] + arr[i + 1][0] + arr[i][1]) / 4 + (last(arr[i - 1]) + last(arr[i + 1])) / 8;
  }

  for (let i = 1; i < arr.length; i += 2) {
    arr[i][arr.length - 1] = (arr[i - 1][arr.length - 1] + arr[i + 1][arr.length - 1] +
      arr[i][arr.length - 2]) / 4 + (arr[i - 1][0] + arr[i + 1][0]) / 8;
  }

  for (let i = 1; i < arr.length - 1; i++) {
    for (let j = 2 - (i + 1) % 2; j < arr[i].length - 1; j += 2) {
      arr[i][j] = [
        [ i - 1, j ],
        [ i, j - 1 ],
        [ i, j + 1 ],
        [ i + 1, j ]
      ]
        .map(([ i0, j0 ]) => arr[i0][j0])
        .reduce((sum, item) => sum + item, 0) / 4;
    }
  }
}

function cutBorders(arr) {
  const cutted = [];

  for (let i = 1; i < arr.length - 1; i++) {
    const row = [];
    for (let j = 1; j < arr[i].length - 1; j++) {
      row.push(arr[i][j]);
    }
    cutted.push(row);
  }

  return cutted;
}

let arr = [
  [ 1, 0, 1 ],
  [ 1, 1, 1 ],
  [ 1, 1, 1 ]
];

let i = 6;

while (i-- > 0) {
  arr = inflate2(arr);
  diamond(arr);
  square(arr);
}

arr = cutBorders(arr);

normalize(arr, 15);

console.log(arr);

function draw(arr) {
  const canv = document.getElementById('canv'),
    ctx = canv.getContext('2d');

  const imageData = ctx.getImageData(0, 0, canv.width, canv.height);

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      const k = (i * arr[i].length + j) * 4;
      const c = 255 - 17 * arr[i][j];

      imageData.data[k] = c;
      imageData.data[k + 1] = c;
      imageData.data[k + 2] = c;
      imageData.data[k + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

draw(arr);
