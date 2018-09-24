export function createElement(tagName, properties) {
  const element = document.createElement(tagName);

  for (const propertyName in properties) {
    if (propertyName === 'style') {
      Object.assign(element.style, properties.style);
    } else if (propertyName in element) {
      element[propertyName] = properties[propertyName];
    } else {
      element.setAttribute(propertyName, properties[propertyName]);
    }
  }

  return element;
}
