import { normalize } from 'utils/common/math.utils.js';
import { createElement } from 'utils/common/dom.utils.js';

export default function distributionDiagram (side) {

  const element = createElement('div', {
    className: 'diagram',
    style: {
      width: `${side}px`,
      height: `${side}px`
    }
  });

  return {
    element,
    update(data) {

      this.element.innerHTML = '';

      const normolized = normalize(data, side);

      normolized.forEach(h => {
        const col = createElement('div', {
          style: {
            height: h + 'px'
          }
        });

        this.element.appendChild(col);
      });

    }
  };
}
