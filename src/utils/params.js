import { identity } from './common/fn.utils.js';
import { forIn } from './common/object.utils.js';

const ENTRIES_SEPARATOR = ';';
const KEY_VALUE_SEPARATOR = ':';

/**
 * TODO: support escaping ?
 * more sophisticated parsing with tokenization ?
 */

export function parseParams(params, parsers = {}) {

  if (params === '') {
    return {};
  }

  const entries = params.split(ENTRIES_SEPARATOR);
  const parsed = {};

  entries.forEach(entry => {
    const [ key, value ] = entry.split(KEY_VALUE_SEPARATOR);
    if (value === '') { // entry === 'key:'
      throw `Missed value for key: ${key}.`;
    }
    const parser = parsers[key] || identity;
    parsed[key] = parser(value);
  });

  return parsed;
}

export function stringifyParams(params, formatters = {}) {
  const entries = [];

  forIn(params, (value, key) => {
    const formatter = formatters[key] || identity;
    const entry = key + KEY_VALUE_SEPARATOR + formatter(value);
    entries.push(entry);
  });

  return entries.join(ENTRIES_SEPARATOR);
}
