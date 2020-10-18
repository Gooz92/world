import { forIn } from 'utils/common//object.utils.js';

export default function assignProperties(element, properties) {
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
}
