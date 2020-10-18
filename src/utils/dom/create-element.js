import assignProperties from './assign-properties.js';

import { isObject, isFunction } from 'utils/common/is.utils.js';
import { forIn } from 'utils/common//object.utils.js';

export default function createElement(query = 'div', ...args) {
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

function appendChildren(element, children) {
  children.forEach(child => {
    element.appendChild(child);
  });
}
