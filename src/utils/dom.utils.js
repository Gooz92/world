import { forIn } from './object.utils.js';

export function createElement(tagName, properties) {
  const element = document.createElement(tagName);

  for (const propertyName in properties) {
    if (propertyName === 'style') {
      Object.assign(element.style, properties.style);
    } else if (propertyName === 'dataset') {
      forIn(properties.dataset, (value, key) => {
        element.dataset[key] = value;
      });
    } else if (propertyName in element) {
      element[propertyName] = properties[propertyName];
    } else {
      element.setAttribute(propertyName, properties[propertyName]);
    }
  }

  return element;
}
