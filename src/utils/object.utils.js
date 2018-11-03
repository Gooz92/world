import { identity } from './fn.utils';

export const omit = (obj, keys) => (
  Object.keys(obj)
    .reduce((result, key) => (
      keys.includes(key) ? result : { ...result, [key]: obj[key] }
    ), {})
);

export function map(obj, cd = identity) {
  const result = {};

  Object.keys(obj)
    .forEach(key => {
      result[key] = cd(obj[key], key);
    });

  return result;
}
