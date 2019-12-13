import ObjectType from 'model/ObjectType.enum.js';
import CutTreesStrategy from 'model/strategies/CutTreesStrategy.js';
import Barn from 'model/buildings/Barn';

const place = type => (
  (worldView, x, y) => worldView.place(x, y, type)
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

function placeBuilding(Building) {
  return (worldView, x, y) => {
    worldView.placeBuilding(Building, x, y);
  };
}

const placePerson = place(ObjectType.PERSON);

const placeBarn = placeBuilding(Barn);

export default [
  {
    id: 'select',
    click: (worldView, x, y, dispatch) => {
      const selection = worldView.select(x, y);
      console.log('selection: ', selection.object);
      dispatch({ selection });
    }
  },

  {
    id: 'person',
    click: (worldView, x, y) => {
      const person = placePerson(worldView, x, y);
      person.setStrategy(CutTreesStrategy);
    }
  },

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
  },

  {
    id: 'barn',
    click: placeBarn
  }
];
