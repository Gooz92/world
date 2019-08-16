import { identity } from './fn.utils.js';

export const omit = (obj, keys) => (
  Object.keys(obj)
    .reduce((result, key) => (
      keys.includes(key) ? result : { ...result, [key]: obj[key] }
    ), {})
);

export function map(obj, cb = identity) {
  const result = {};

  forIn(obj, (value, key) => {
    result[key] = cb(value, key);
  });

  return result;
}

export function forIn(obj, cb) {
  Object.keys(obj)
    .forEach(key => {
      cb(obj[key], key);
    });
}

// TODO: escape dots, default value
export function get(obj, path) {

  if (!Array.isArray(path)) {
    return get(obj, path.split('.'));
  }

  let index = 0, length = path.length;

  while (obj != null && index < length) {
    obj = obj[path[index++]];
  }

  return index === length ? obj : undefined;
}
