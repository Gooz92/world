import { createElement } from '../utils/dom.utils.js';
import ObjectType from '../model/ObjectType.js';

export default function createMenu(options) {

  const menu = createElement('ul');

  [
    { name: 'Obstacle', id: ObjectType.OBSTACLE },
    { name: 'Tree', id: ObjectType.TREE },
    { name: 'Person', id: ObjectType.PERSON }
  ].forEach(({ name, id }) => {
    const li = createElement('li');

    const label = createElement('label', {
      innerHTML: name,
      htmlFor: name
    });

    const radioButton = createElement('input', {
      id: name,
      value: id,
      name: 'object',
      type: 'radio',
      onchange: event => {
        options.onChange(+event.target.value);
      }
    });

    li.appendChild(label);
    li.appendChild(radioButton);

    menu.appendChild(li);
  });

  return menu;
}
