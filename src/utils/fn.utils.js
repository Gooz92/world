export const noop = () => {};

export const identity = arg => arg;

export const constant = arg => () => arg;

export const getObject = () => ({});

export const getTrue = () => true;

export const getFalse = () => false;

export const getNull = () => null;

export const getZero = () => 0;

export function debounce(fn, wait = 0) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, wait);
  };
}
