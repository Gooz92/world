import { forIn } from './object.utils.js';

const PAIRS_SEPARATOR = ';', KEY_VALUE_SEPARATOR = ':';

export function serialize(params = {}) {
  const serialized = [];

  forIn(params, (value, key) => {
    serialized.push(key + KEY_VALUE_SEPARATOR + value);
  });

  return serialized.join('&');
}

export function desirialize(params, config = {}) {
  const desirialized = {};

  params
    .split(PAIRS_SEPARATOR)
    .forEach(pair => {
      const [ key, value ] = pair.split(KEY_VALUE_SEPARATOR);
      desirialized[key] = config[key] ? config[key](value) : value;
    });

  return desirialized;
}


