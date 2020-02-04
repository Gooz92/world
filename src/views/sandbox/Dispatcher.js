import { noop } from 'utils/common/fn.utils.js';

export default {
  _callback: noop,

  dispatch(actionType, payload) {
    this._callback(actionType, payload);
  },

  register(callback) {
    this._callback = callback;
  }
};
