import { isArray, isObject } from './is.utils.js';

export default function deepEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }

  if (isArray(obj1) && isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    return obj1.every((item, index) => deepEqual(item, obj2[index]));
  } else if (isObject(obj1) && isObject(obj2)) {
    return Object.keys(obj1).every(key => deepEqual(obj1[key], obj2[key]));
  }

  return false;
}
