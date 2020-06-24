import select from 'views/components/select';

export default class ToolsSelector {

  constructor(state, { tools, onToolSelect }) {
    const component = select(tools, onToolSelect, {});

    this.component = component;
    this.element = component.element;
  }

  update({ tool }) {
    this.component.update({ selectedItem: tool });
  }
}
