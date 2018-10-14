import { createElement } from '../utils/dom.utils.js';
import ObjectType from '../model/ObjectType.js';

export default function createMenu(options) {

  const menu = createElement('ul', { className: 'menu' });

  const items = [];

  let value = null;

  [
    { name: 'Obstacle', id: ObjectType.OBSTACLE },
    { name: 'Tree', id: ObjectType.TREE },
    { name: 'Person', id: ObjectType.PERSON }
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

        target.style.fontWeight = id !== value ? 'bold' : 'normal';

        value = id;

        options.onChange(value);
      }
    });

    items.push(li);

    menu.appendChild(li);
  });

  return menu;
}
