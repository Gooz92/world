import { createElement } from 'utils/common/dom.utils.js';

export default class BottomPanel {

  static TilePosition = class {

    constructor({ tilePosition }) {
      this.element = createElement('span#tile-position');
      this.update({ tilePosition });
    }

    update({ tilePosition }) {
      this.element.innerHTML = tilePosition.join('; ');
    }
  };

  constructor(state, config) {
    const { controls } = config;

    this.element = createElement('#bottom-panel');

    this.controls = [];

    this.tool = config.tools[0];

    this.state = {
      ...state,
      tool: this.tool,
      tilePosition: [ 0, 0 ]
    };

    controls.forEach(Control => {
      const control = new Control(this.state, config);
      this.controls.push(control);
      this.element.appendChild(control.element);
    });

    this.update(this.state);
  }

  update(delta) {
    // TODO: mutate state and collect all changes is it ok?
    Object.assign(this.state, delta);

    this.tool = this.state.tool;

    this.controls.forEach(control => {
      control.update(this.state);
    });
  }
}
