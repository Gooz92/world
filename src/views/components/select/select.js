import { createElement } from 'utils/dom';
import { noop } from 'utils/common/fn.utils';

export default function select(items, onChange = noop, options = {}) {

  const component = {
    element: createElement('select',
      {
        onchange: event => {
          const item = items[event.target.selectedIndex];
          onChange(item);
          component.selectedItem = item;
        },
        ...options
      },
      items.map(item => (
        createElement('option', {
          value: item.id || item,
          innerText: item.name || item.id || item
        })
      ))
    ),

    selectedItem: items[0],

    update({ selectedItem }) {
      const selectedIndex = items.indexOf(selectedItem);

      if (selectedIndex >= 0 && selectedIndex < items.length) {
        component.element.selectedIndex = selectedIndex;
        component.selectedItem = selectedItem;
      } else {
        throw new Error('Invalid selected item');
      }
    }
  };

  return component;
}
