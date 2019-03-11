import { createElement } from 'utils/dom.utils.js';
import { noop } from 'utils/fn.utils.js';

export default function range({ min = 0, max = 100, step = 1 } = {}, onChange = noop) {

  // const element = createElement('div', [
  //   createElement('label', {
  //     for: id
  //   }),
  //   createElement('input', {
  //     type: 'range',
  //     onchange(e) {
  //       onChange(e.target.value);
  //     },
  //     min, max, step
  //   }),
  //   createElement('span', )
  // ]);

  const element = createElement('input', {
    type: 'range',
    onchange(e) {
      onChange(e.target.value);
    },
    min, max, step
  });

  return {
    element
  };
}
