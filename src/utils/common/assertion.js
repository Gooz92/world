import isDeepEqual from './deep-equal.js';

const ERROR_MESSAGE = 'Assertion error';

function throwAssertionError(message) {
  throw message ? `${ERROR_MESSAGE}: ${message}`: ERROR_MESSAGE;
}

function assert(expression, message) {
  if (!expression) {
    throwAssertionError(message);
  }
}

export function isTrue(condition, message) {
  assert(condition === true, message);
}

export function isFalse(condition, message) {
  assert(condition === false, message);
}

export function equal(a, b) {
  assert(a === b, `${a} === ${b}`);
}

export function notEqual(a, b) {
  assert(a !== b, `${a} !== ${b}`);
}

export function isNull(arg) {
  equal(arg, null);
}

export function deepEqual(a, b) {
  isTrue(isDeepEqual(a, b));
}
