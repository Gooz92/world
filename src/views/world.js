import generateWorld from '../generate-world.js';
import ObjectType from '../model/ObjectType.js';
import { createElement } from '../utils/dom.utils.js';
import { noop } from '../utils/fn.utils.js';
import createField from '../create-field.js';

const TICK_TIME = 80;

// @ - person, O - tree

let timeoutId;

const hadlers = {
  idle: noop,

  move({ data: { from, to } }) {
    const [ fromX, fromY ] = from;
    const [ toX, toY ] = to;

    const startCell = cells[fromY][fromX];
    const endCell = cells[toY][toX];

    startCell.className = '';
    endCell.className = 'person';
  },

  cutTree({ data: { treePosition: [ x, y ] } }) {
    cells[y][x].className = 'empty';
  }
};

export default {
  enter: _ => {
    const world = generateWorld(64, 64, [
      [ 50, () => null ],
      [ 1, () => ({ type: ObjectType.TREE }) ],
      [ 4, () => ({ type: ObjectType.OBSTACLE }) ]
    ]);

    const { table, cells } = createField(world.tiles);

    function tick() {
      world.objects
        .forEach(object => {
          const event = object.act();
          hadlers[event.type](event);
        });
    }

    function gameLoop() {
      tick();
      timeoutId = setTimeout(gameLoop, TICK_TIME);
    }

    const stepButton = createElement('button', {
      innerHTML: 'Step',
      onclick: () => {
        tick();
      }
    });

    const playButton = createElement('button', {
      innerHTML: 'Play',
      onclick: () => {
        playButton.disabled = true;
        stopButton.disabled = false;
        gameLoop();
      }
    });

    const stopButton = createElement('button', {
      innerHTML: 'Stop',
      disabled: true,
      onclick: () => {
        clearTimeout(timeoutId);
        stopButton.disabled = true;
        playButton.disabled = false;
      }
    });

    // const menu = createMenu();

    document.body.appendChild(table);

    world.objects
      .forEach(({ position: [ x, y ] }) => {
        cells[y][x].className = 'person';
      });

    document.body.appendChild(playButton);
    document.body.appendChild(stopButton);
    document.body.appendChild(stepButton);

    // gameLoop();
  },

  leave: _ => {
    document.body.innerHTML = '';
    clearTimeout(timeoutId);
  }
};
