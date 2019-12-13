import { createElement } from 'utils/common/dom.utils.js';

export default function select(items, onChange) {

  const component = {
    element: createElement('select', {
      onchange: event => {
        const item = items[event.target.selectedIndex];
        onChange(item);
        component.selectedItem = item;
      }
    }),

    selectedItem: items[0]
  };

  items.forEach((item, index) => {
    const option = createElement('option', {
      value: item.id || index,
      innerText: item.name || item.id
    });

    component.element.appendChild(option);
  });

  return component;
}
