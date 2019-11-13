import ObjectType from 'model/ObjectType.enum.js';

const place = type => (
  (worldView, x, y) => {
    worldView.place(x, y, type);
  }
);

function placeOnArea(type) {
  let startX, startY;

  let endX, endY;

  let mdown = false;

  return {
    mouseDown: (worldView, x, y) => {
      startX = x;
      startY = y;
      endX = x;
      endY = y;
      mdown = true;
    },

    mouseMove: (worldView, x, y) => {
      if (!mdown) {
        return;
      }

      const oldWidth = endX - startX, oldHeight = endY - startY;

      worldView.viewport.clearArea(startX, startY, oldWidth, oldHeight);

      endX = x;
      endY = y;

      const width = endX - startX, height = endY - startY;

      if (worldView.isAreaPlaceable(startX, startY, width, height)) {
        worldView.viewport.drawArea(startX, startY, width, height);
      } else {
        worldView.viewport.drawRedArea(startX, startY, width, height);
      }
    },

    mouseUp: (worldView, x, y) => {
      const width = x - startX, height = y - startY;

      worldView.viewport.clearArea(startX, startY, width, height);

      if (worldView.isAreaPlaceable(startX, startY, width, height)) {
        worldView.placeArea(startX, startY, width, height, { terrain: type });
      }

      mdown = false;
    }
  };
}

export default [
  {
    id: 'select',
    click: (worldView, x, y) => {
      worldView.select(x, y);
    }
  },

  { id: 'person', click: place(ObjectType.PERSON) },
  { id: 'tree', click: place(ObjectType.TREE) },

  {
    id: 'erase',
    click: (worldView, x, y ) => {
      worldView.clearTile(x, y);
    }
  },

  {
    id: 'stock',
    ...placeOnArea(ObjectType.STOCK)
  }
];
