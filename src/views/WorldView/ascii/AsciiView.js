import { createElement, assignProperties } from 'utils/dom';
import colorPool from './color-pool.js';
import ObjectType from 'model/ObjectType.enum.js';

export default class AsciiView {

  static CLASS_NAME = 'ascii-field';

  static CELL_SIZE = 16;

  static TOKENS = {
    tree: 'o',
    person: '@',
    obstacle: '#',
    food: '%',
    stock: '_',
    wood: '='
  };

  constructor(world) {
    this.world = world;
    this.cells = [];

    this.getActorNextColor = colorPool();

    this.actorClasses = {};
  }

  createElement() {
    const field = createElement('.' + AsciiView.CLASS_NAME, {
      style: {
        width: (AsciiView.CELL_SIZE * this.world.width) + 'px',
        height: (AsciiView.CELL_SIZE * this.world.height) + 'px'
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

    const attributes = {
      innerHTML: ' '
    };

    if (tile.object) {
      const { object } = tile;
      attributes.innerHTML = AsciiView.TOKENS[object.type.name];

      if (object.type === ObjectType.PERSON) {
        if (!this.actorClasses[object.name]) {
          this.actorClasses[object.name] = this.getActorNextColor();
        }

        attributes.className = this.actorClasses[object.name];
      }

      return attributes;
    }

    if (tile.terrain) {
      attributes.innerHTML = AsciiView.TOKENS[tile.terrain.type.name];
    }

    return attributes;
  }
}
