import { createElement } from 'utils/common/dom.utils.js';

export default class ToolsSelector {

  constructor(state, { tools, dispatch }) {
    const element = this.element = createElement('select.tools');

    tools.forEach(tool => {
      const option = createElement('option', {
        value: tool.id,
        innerHTML: tool.name || tool.id
      });

      element.appendChild(option);
    });

    element.onchange = event => {
      dispatch({ tool: tools[element.selectedIndex] });
    };
  }

  update({ tool }) {
    this.element.value = tool.id;
  }
}
