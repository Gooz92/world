export default function createMenu() {
  const menu = createElement('ul', { className: 'menu' });

  brushes.forEach(brush => {
    const item = createElement('li');

    const label = createElement('label', {
      htmlFor: brush, // reflects 'for' attribute
      innerHTML: brush
    });

    const radioButton = createElement('input', {
      id: brush,
      type: 'radio',
      name: 'brush',
      value: brush
    });

    item.appendChild(label);
    item.appendChild(radioButton);

    menu.appendChild(item);
  });

  return menu;
}
