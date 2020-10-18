export const isFunction = arg => typeof arg === 'function';

export const isUndefined = arg => typeof arg === 'undefined';

export const isString = arg => typeof arg === 'string';

export const isArray = arg => Array.isArray(arg);

export const isObject = arg => (
  arg !== null && !isArray(arg) && typeof arg === 'object'
);
