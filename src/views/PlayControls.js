import { createElement } from 'utils/common/dom.utils.js';

const BUTTONS = [
  [ 'Play', { isPlayed: true }],
  [ 'Step', { type: 'step' }],
  [ 'Stop' , { isPlayed: false }]
];

export default class PlayControls {

  constructor(state, { dispatch }) {
    this.element = createElement('#play-controls');
    this.dispatch = dispatch;

    BUTTONS.forEach(([ name, data ]) => {
      const button = createElement('button', {
        innerHTML: name,
        onclick: () => {
          this.dispatch(data);
        }
      });

      this[name.toLowerCase() + 'Button'] = button;
      this.element.appendChild(button);
    });
  }

  update({ isPlayed }) {
    this.playButton.disabled = isPlayed;
    this.stepButton.disabled = isPlayed;
    this.stopButton.disabled = !isPlayed;
  }
}
