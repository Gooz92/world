import { createElement } from 'utils/common/dom.utils.js';
import { getSeed } from 'utils/common/random.utils.js';

export default function seed(value, onValueChanged) {

  const input = createElement('input', { value });

  const update = value => {
    input.value = value;
  };

  const container = createElement('div.seed-component', [
    input,
    createElement('button', {
      innerHTML: '&#x21bb',
      onclick: () => {
        const seed = getSeed();
        onValueChanged(seed);
        update(seed);
      }
    })
  ]);

  return {
    element: container,
    update
  };
}
