import { createElement } from 'utils/common/dom.utils.js';
import ObjectType from 'model/ObjectType.enum.js';

const createPlaceAction = objectType => (
  (view, x, y) => {
    view.place(x, y, objectType);
  }
);

export default function createMenu(options) {

  const menu = createElement('ul', { className: 'menu' });

  const items = [];

  let selectedItem = null;

  [
    {
      name: 'Obstacle',
      id: ObjectType.OBSTACLE.id,
      action: createPlaceAction(ObjectType.OBSTACLE)
    },
    {
      name: 'Tree',
      id: ObjectType.TREE.id,
      action: createPlaceAction(ObjectType.TREE)
    },
    {
      name: 'Person',
      id: ObjectType.PERSON.id,
      action: createPlaceAction(ObjectType.PERSON)
    },
    {
      name: 'Stock',
      id: ObjectType.STOCK.id,
      action: (view, x, y) => {
        view.placeStock(x, y);
      }
    },
    {
      name: 'Erase',
      id: 0,
      action: (view, x, y) => {
        view.clearTile(x, y);
      }
    }
  ].forEach(item => {

    const { name } = item;

    const li = createElement('li', {
      id: name.toLowerCase(),
      innerHTML: name,
      onclick: event => {
        const target = event.currentTarget;

        items
          .filter(item => item !== target)
          .forEach(item => {
            item.style.fontWeight = 'normal';
          });

        if (item === selectedItem) {
          target.style.fontWeight = 'normal';
          selectedItem = null;
        } else {
          target.style.fontWeight = 'bold';
          selectedItem = item;
        }

        options.onChange(selectedItem);
      }
    });

    items.push(li);

    menu.appendChild(li);
  });

  return menu;
}
