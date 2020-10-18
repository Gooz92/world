const noop = () => {};

module.exports = function spy(fn = noop) {
  const $spy = function (...args) {
    $spy.calls.push(args);
    return fn(...args);
  };

  $spy.calls = [];

  return $spy;
};
