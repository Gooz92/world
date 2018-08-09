import calculateDistance from '../calculate-distance.js';
import { createTable } from '../utils/dom.utils.js';

export default {
  enter: _ => {
    const table = createTable(61, 61, (cell, x, y) => {
      const distance = calculateDistance(30, 30, x, y) / 2;
      
      if (distance < 30) {
        cell.style.backgroundColor = 'black';
      }
    });

    document.body.appendChild(table);
  },

  leave: _ => {
    document.body.innerHTML = '';
  }
};
