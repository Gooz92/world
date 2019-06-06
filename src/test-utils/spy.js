import { noop } from 'utils/common/fn.utils.js';

export default function spy(fn = noop) {

  const $spy = function (...args) {
    $spy.calls.push(args);
    return fn(...args);
  };

  $spy.calls = [];

  return $spy;
}
