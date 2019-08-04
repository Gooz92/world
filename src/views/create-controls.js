import { createElement } from 'utils/common/dom.utils.js';
import { time } from 'utils/common/dev.utils.js';

export default function createControls(tick, tickTime) {

  let timeoutId;

  const gameLoop = () => {
    time('tick', tick);
    timeoutId = setTimeout(gameLoop, tickTime);
  };

  const buttons = {
    step: createElement('button', {
      innerHTML: 'Step',
      onclick: tick
    }),

    play: createElement('button', {
      innerHTML: 'Play',
      onclick: () => {
        buttons.play.disabled = true;
        buttons.stop.disabled = false;
        gameLoop();
      }
    }),

    stop: createElement('button', {
      innerHTML: 'Stop',
      disabled: true,
      onclick: () => {
        clearTimeout(timeoutId);
        buttons.stop.disabled = true;
        buttons.play.disabled = false;
      }
    }),

    reload: createElement('button', {
      innerHTML: 'Regenerate',
      onclick: () => {
        clearTimeout(timeoutId);
        location.hash = '';
      }
    })
  };

  const container = document.createDocumentFragment();

  Object.keys(buttons)
    .forEach(buttonName => {
      container.appendChild(buttons[buttonName]);
    });

  return {
    container,
    get timeoutId() {
      return timeoutId;
    }
  };
}
