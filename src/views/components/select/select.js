import { createElement } from 'utils/common/dom.utils.js';

export default function select(items, onChange) {
  const selectElement = createElement('select', {
    onchange: event => {
      const item = items[event.target.selectedIndex];
      onChange(item);
    }
  });

  items.forEach((item, index) => {
    const option = createElement('option', {
      value: item.id || index,
      innerText: item.name
    });

    selectElement.appendChild(option);
  });

  return {
    element: selectElement
  };
}
