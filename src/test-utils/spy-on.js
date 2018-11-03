import spy from './spy.js';

export default function spyOn(obj, methodName) {
  const method = obj[methodName].bind(obj);
  obj[methodName] = spy((...args) => method(...args));
  return obj[methodName];
}
