import { forIn } from './object.utils.js';
import { isObject, isFunction } from './is.utils.js';

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

function createElementByQuery(query) {

  const { tag, id, className } = parseQuery(query);
  const element = document.createElement(tag);

  if (id) {
    element.id = id;
  }

  if (className) {
    element.className = className;
  }

  return element;
}

export function createElement(query = 'div', ...args) {

  const element = createElementByQuery(query);

  args.forEach(arg => {
    if (Array.isArray(arg)) {
      appendChildren(element, arg);
    } else if (isObject(arg)) {
      assignProperties(element, arg);
    } else if (isFunction(arg)) {
      arg(element);
    }
  });

  return element;
}

const PATTERNS = {
  id: /#([^#\.]+)/,
  className: /\.([^#\.]+)/,
  tag: /^(\w+)/
};

export function parseQuery(query) {
  const element = { tag: 'div' };

  forIn(PATTERNS, (pattern, tokenName) => {
    const match = query.match(pattern);
    if (match) {
      element[tokenName] = match[1];
    }
  });

  return element;
}