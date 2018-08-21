import { noop } from './fn.utils.js';

export function createElement(tagName, properties)  {
  return Object.assign(document.createElement(tagName), properties);
}

export function createTable(rowCount, colCount, onCellCreated = noop) {
  const table = createElement('table');
  const tbody = createElement('tbody');

  for (let i = 0; i < rowCount; i++ ) {
    const row = createElement('tr');
    for (let j = 0; j < colCount; j++) {
      const cell = createElement('td');
      row.appendChild(cell);
      onCellCreated(cell, i, j);
    }
    tbody.appendChild(row);
  }

  table.appendChild(tbody);

  return table;
}
