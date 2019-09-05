import { createElement, assignProperties } from 'utils/common/dom.utils.js';

export default class AsciiView {

  static CELL_SIZE = 16;

  static TOKENS = {
    tree: '^',
    person: '@',
    obstacle: '#'
  };

  constructor(world) {
    this.world = world;
    this.cells = [];
  }

  createElement() {
    const field = createElement('.ascii-field', {
      style: {
        width: (AsciiView.CELL_SIZE * this.world.width) + 'px',
        height: (AsciiView.CELL_SIZE * this.world.height) + 'px',
      }
    });

    const tiles = this.world.tiles;

    for (let y = 0; y < tiles.length; y++) {
      const row = [];
      for (let x = 0; x < tiles[y].length; x++) {
        const tile = createElement('div', {
          dataset: { x, y },
          ...this.getTileAttributes(x, y)
        });
        field.appendChild(tile);
        row.push(tile);
      }
      this.cells.push(row);
    }

    return field;
  }

  tick() {
    const actions = this.world.tick();

    actions
      .forEach(event => {
        event.tiles.forEach(([ x, y ]) => {
          this.refreshTile(x, y);
        });
      });
  }

  refreshTile(x, y) {
    const tileAttributes = this.getTileAttributes(x, y);
    const cell = this.cells[y][x];
    assignProperties(cell, tileAttributes);
  }

  getTileAttributes(x, y) {
    const tile = this.world.getTile(x, y);

    return {
      innerHTML: tile.object ? AsciiView.TOKENS[tile.object.type.name] : '.'
    };
  }
}
