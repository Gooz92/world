import { isArraysEqual } from './array.utils.js';
import { isArray, isObject } from './is.utils.js';

function checkLoop(obj1, obj2, visitedMap) {
  const visited = visitedMap.get(obj1);
  if (visited === obj2) {
    return true;
  }
  visitedMap.set(obj1, obj2);
  visitedMap.set(obj2, obj1);
}

export default function deepEqual(obj1, obj2, visitedMap = new Map()) {
  if (obj1 === obj2) {
    return true;
  }

  if (isArray(obj1) && isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    if (checkLoop(obj1, obj2, visitedMap)) {
      return true;
    }
    return obj1.every((item, index) => deepEqual(item, obj2[index], visitedMap));
  } else if (isObject(obj1) && isObject(obj2)) {
    if (checkLoop(obj1, obj2, visitedMap)) {
      return true;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (!isArraysEqual(keys1, keys2)) {
      return false;
    }
    return keys1.every(key => deepEqual(obj1[key], obj2[key], visitedMap));
  }

  return false;
}
