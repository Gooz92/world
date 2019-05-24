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
