import { last } from 'utils/common/array.utils.js';

function defaultSetData(node, data) {
  node.data = data;
}

export default function buildLinkedList(array, setData = defaultSetData) {
  let previous = null;
  let node = {};

  for (let i = 0; i < array.length - 1; i++) {
    const next = {};
    node.previous = previous;
    node.next = next;
    setData(node, array[i]);
    previous = node;
    node = next;
  }

  node.previous = previous;
  node.next = null;
  setData(node, last(array));

  return node;
}
