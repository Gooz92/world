import { createElement } from 'utils/common/dom.utils.js';

export default function createCanvas(width, height) {

  const canvas = createElement('canvas', {
    width, height
  });

  const context = canvas.getContext('2d');

  return {
    element: canvas,
    context,
    update(data) {
      const { width, height } = this.element;
      const image = this.context.getImageData(0, 0, width, height);

      data.forEach((item, index) => {
        const startIndex = index * 4;

        image.data[startIndex] = item;
        image.data[startIndex + 1] = item;
        image.data[startIndex + 2] = item;
        image.data[startIndex + 3] = 255;
      });

      context.putImageData(image, 0, 0);
    }
  };
}
