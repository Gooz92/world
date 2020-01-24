import ObjectType from 'model/ObjectType.enum.js';
import CutTreesStrategy from 'model/strategies/CutTreesStrategy.js';
import Barn from 'model/buildings/Barn';
import { generateArray } from 'utils/common/array.utils';
import { getTrue } from 'utils/common/fn.utils';

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

  let active = false;

  let prevX, prevY;

  const { WIDTH: width, HEIGHT: height } = Building;

  const mask = generateArray(height, width, getTrue);

  return {
    click: (worldView, x, y) => {
      if (worldView.isAreaPlaceable(x, y, width, height)) {
        worldView.placeBuilding(Building, x, y);
      }
    },

    mouseMove(worldView, x, y) {
      if (active) {
        worldView.viewport.clearArea(prevX, prevY, width, height);
      } else {
        active = true;
      }

      if (worldView.isAreaPlaceable(x, y, width, height)) {
        worldView.viewport.drawMask(x, y, mask);
      } else {
        worldView.viewport.drawRedArea(x, y, width, height);
      }

      prevX = x;
      prevY = y;
    },

    keyDown(worldView, key) {
      if (key === 'r') {
        console.log('rotate');
      }
    }
  };
}

const placePerson = place(ObjectType.PERSON);

export default [
  {
    id: 'select',
    click: (worldView, x, y, dispatch) => {
      const selection = worldView.select(x, y);
      window.__selection__ = selection;
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
    ...placeBuilding(Barn)
  }
];
