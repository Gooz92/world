const spy = require('./spy.js');

module.exports = function spyOn(obj, methodName) {
  const method = obj[methodName].bind(obj);
  obj[methodName] = spy((...args) => method(...args));
  return obj[methodName];
};
