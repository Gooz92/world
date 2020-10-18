import { createElement } from 'utils/dom';
import { upperFirst } from 'utils/common/string.utils.js';

const BUTTONS = [
  'play',
  'stop',
  'step'
];

export default class PlayControls {

  constructor(state, { onPlay, onStop, onStep }) {
    this.element = createElement('#play-controls');

    this.onPlay = onPlay;
    this.onStop = onStop;
    this.onStep = onStep;

    BUTTONS.forEach(btnId => {
      const name = upperFirst(btnId);
      const button = createElement('button', {
        id: btnId,
        innerHTML: name,
        onclick: () => {
          this[`on${name}`]();
        }
      });

      this[`${btnId}Button`] = button;
      this.element.appendChild(button);
    });
  }

  update({ isPlayed }) {
    this.playButton.disabled = isPlayed;
    this.stepButton.disabled = isPlayed;
    this.stopButton.disabled = !isPlayed;
  }
}
