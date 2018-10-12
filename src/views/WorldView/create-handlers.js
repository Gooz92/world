import { lowerFirst } from 'utils/string.utils.js';

const HADLER_NAME_PATTERN = /^handle(.+)$/;

export default function createHandlers(proto) {
  return Object.getOwnPropertyNames(proto)
    .reduce((handlers, methodName) => {
      const match = HADLER_NAME_PATTERN.exec(methodName);

      if (match) {
        const actionName = lowerFirst(match[1]);
        handlers[actionName] = proto[methodName];
      }

      return handlers;
    }, {});
}
