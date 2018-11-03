const noop = () => {};

export default function spy(fn = noop) {

  const s = function (...args) {
    s.calls.push(args);
    return fn(...args);
  };

  s.calls = [];

  return s;
}
