import { createElement } from 'utils/common/dom.utils.js';
import ObjectType from 'model/ObjectType.enum.js';

export default function createMenu(options) {

  const menu = createElement('ul', { className: 'menu' });

  const items = [];

  let value = null;

  [
    { name: 'Obstacle', id: ObjectType.OBSTACLE.id },
    { name: 'Tree', id: ObjectType.TREE.id },
    { name: 'Person', id: ObjectType.PERSON.id },
    { name: 'Erase', id: 0 }
  ].forEach(({ name, id }) => {

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

        if (id === value) {
          target.style.fontWeight = 'normal';
          value = null;
        } else {
          target.style.fontWeight = 'bold';
          value = id;
        }

        options.onChange(value);
      }
    });

    items.push(li);

    menu.appendChild(li);
  });

  return menu;
}
