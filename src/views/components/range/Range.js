import { createElement } from 'utils/common/dom.utils.js';
import { noop } from 'utils/common/fn.utils.js';

export default function range(id, name, properties, onChange = noop) {

  const valueContainer = createElement('span');

  const input = createElement('input', {
    ...properties,
    onchange: e => {
      const value = e.target.value;
      onChange(value);
      valueContainer.innerHTML = value;

    },
    type: 'range',
    id
  });

  valueContainer.innerHTML = input.value;

  const label = createElement('label', {
    for: id,
    innerHTML: `${name}:`
  });

  const element = createElement('div', [
    label,
    input,
    valueContainer
  ]);

  return {
    input,
    element
  };
}
