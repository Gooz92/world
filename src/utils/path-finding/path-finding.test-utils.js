function defaultSetData(node, data) {
  node.data = data;
}

export default function buildLinkedList(array, setData = defaultSetData) {
  let previous = null, node;

  for (let i = 0; i < array.length; i++) {
    node = {};
    setData(node, array[i]);
    node.previous = previous;
    previous = node;
  }

  return node;
}
