import { createElement } from 'utils/common/dom.utils.js';

export default class ToolsSelector {

  constructor(state, { tools, dispatch }) {
    const element = this.element = createElement('select.tools');

    tools.forEach(tool => {
      const select = createElement('option', {
        value: tool.id,
        innerHTML: tool.id
      });

      element.appendChild(select);
    });

    element.onchange = event => {
      dispatch({ tool: tools[element.selectedIndex] });
    };
  }

  update({ tool }) {
    this.element.value = tool.id;
  }
}
