import { createElement } from 'utils/dom';
import { identity } from 'utils/common/fn.utils.js';

function createFormRow(id, name, value) {
  const row = createElement('div');

  const label = createElement('label', {
    for: id,
    innerHTML: name
  });

  const input = createElement('input', {
    type: 'text',
    value,
    id,
    name: id
  });

  row.appendChild(label);
  row.appendChild(input);

  return row;
}

export default function createForm(fields, onSubmit) {

  const form = createElement('form', {
    onsubmit: e => {
      const params = {};

      fields.forEach(field => {
        const fieldElement = e.target.querySelector(`#${field.id}`);
        const parse = field.parse || identity;
        params[field.id] = parse(fieldElement.value);
      });

      onSubmit(params);

      return false;
    }
  });

  fields.forEach(field => {
    const row = createFormRow(field.id, field.name || field.id, field.value);
    form.appendChild(row);
  });

  const submit = createElement('input', {
    type: 'submit',
    value: 'ok'
  });

  form.appendChild(submit);

  return { element: form };
}
