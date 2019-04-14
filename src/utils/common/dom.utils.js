import { forIn } from './object.utils.js';

function assignProperties(element, properties) {
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

function appendChildren(element, children) {
  children.forEach(child => {
    element.appendChild(child);
  });
}

export function createElement(tagName = 'div', ...args) {
  const element = document.createElement(tagName);

  args.forEach(arg => {
    if (Array.isArray(arg)) {
      appendChildren(element, arg);
    } else if (typeof arg === 'object') {
      assignProperties(element, arg);
    } else if (typeof arg === 'function') {
      arg(element);
    }
  });

  return element;
}
