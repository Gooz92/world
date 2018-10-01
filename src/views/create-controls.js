import { createElement } from '../utils/dom.utils.js';

export default function createControls(worldView, tickTime) {

  let timeoutId;

  const gameLoop = () => {
    worldView.tick();
    timeoutId = setTimeout(gameLoop, tickTime);
  };

  const buttons = {
    step: createElement('button', {
      innerHTML: 'Step',
      onclick: () => {
        worldView.tick();
      }
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
    })
  };

  const container = document.createDocumentFragment();

  Object.keys(buttons)
    .forEach(buttonName => {
      container.appendChild(buttons[buttonName]);
    });

  return container;
}
