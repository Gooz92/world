import isDeepEqual from './deep-equal.js';

export function isTrue(condition) {
  if (condition !== true) {
    throw 'Assertion error';
  }
}

export function isFalse(condition) {
  if (condition !== false) {
    throw 'Assertion error';
  }
}

export function equal(a, b) {
  isTrue(a === b);
}

export function notEqual(a, b) {
  isTrue(a !== b);
}

export function isNull(arg) {
  equal(arg, null);
}

export function deepEqual(a, b) {
  isTrue(isDeepEqual(a, b));
}
