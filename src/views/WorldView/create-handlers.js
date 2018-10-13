import { lowerFirst } from 'utils/string.utils.js';

const HANDLER_NAME_PATTERN = /^handle(.+)$/;

export function doMatch(methodName) {
  const match = HANDLER_NAME_PATTERN.exec(methodName);
  return match ? lowerFirst(match[1]) : false;
}

export default function createHandlers(proto) {
  return Object.getOwnPropertyNames(proto)
    .reduce((handlers, methodName) => {
      const match = doMatch(methodName);

      if (match) {
        handlers[match] = proto[match];
      }

      return handlers;
    }, {});
}
