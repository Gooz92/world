import { createElement } from './utils/dom.utils.js';

export default function createField(width, height, cellSize, createCell) {
  const table = createElement('div', {
    className: 'field',
    style: {
      width: `${width * cellSize}px`,
      height: `${height * cellSize}px`
    }
  });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = createCell(x, y);
      table.appendChild(cell);
    }
  }

  return table;
}
