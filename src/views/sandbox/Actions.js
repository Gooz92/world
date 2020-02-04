import Dispatcher from './Dispatcher.js';

export default {
  onToolSelect(tool) {
    Dispatcher.dispatch('TOOL_SELECT', tool);
  },

  onPlay() {
    Dispatcher.dispatch('PLAY');
  },

  onStop() {
    Dispatcher.dispatch('STOP');
  },

  onStep() {
    Dispatcher.dispatch('STEP');
  }
};
