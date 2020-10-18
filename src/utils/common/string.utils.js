import { isObject, isString } from './is.utils.js';

export const lowerFirst = str => (
  str.charAt(0).toLowerCase() + str.substr(1)
);

export const upperFirst = str => (
  str.charAt(0).toUpperCase() + str.substr(1)
);

export const camelCase = (str, separator = '_') => {
  const words = str.split(separator).map(world => world.toLowerCase());
  const first = words.shift();

  return first + words.map(upperFirst).join('');
};

export function stringifyArray(arr, depth) {
  if (depth > 0) {
    return '[ ' + arr.map(item => stringify(item, depth - 1)).join(', ') + ' ]';
  }

  return `[${arr.length > 0 ? '...' : ''}]`;
}

export function stringifyObject(obj, depth) {
  const keys = Object.keys(obj);

  if (depth > 0) {
    return '{ ' +
      // key should be formatted somehow ?
      keys.map(key => `${key}: ${stringify(obj[key], depth - 1)}`).join(', ') +
    ' }';
  }

  return `{${keys.length > 0 ? '...' : ''}}`;
}

export function stringifyPrimitive(arg) {
  return isString(arg) ? `'${arg}'` : arg;
}

export function stringify(obj, depth = 1) {
  if (Array.isArray(obj)) {
    return stringifyArray(obj, depth);
  }

  if (isObject(obj)) {
    return stringifyObject(obj, depth);
  }

  return stringifyPrimitive(obj);
}
