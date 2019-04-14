import { normalize } from 'utils/common/math.utils.js';
import { createElement } from 'utils/common/dom.utils.js';

export default function distributionDiagram (width, height) {

  const element = createElement('div', {
    className: 'diagram',
    style: {
      width: `${width}px`,
      height: `${height}px`
    }
  });

  return {
    element,
    update(data) {

      this.element.innerHTML = '';

      const normolized = normalize(data, height);

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
