import { createElement } from 'utils/common/dom.utils.js';

export default class ToolsSelector {

  constructor(state, { tools, onToolSelect }) {
    const element = this.element = createElement('select.tools');

    tools.forEach(tool => {
      const option = createElement('option', {
        value: tool.id,
        innerHTML: tool.name || tool.id
      });

      element.appendChild(option);
    });

    element.onchange = event => {
      onToolSelect(tools[element.selectedIndex]);
    };
  }

  update({ tool }) {
    this.element.value = tool.id;
  }
}
