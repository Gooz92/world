const getPosition = node => node.position;

export default function backtracePath(node, getPathNode = getPosition) {
  const path = [];

  while (node.previous) {
    const pathNode = getPathNode(node);
    path.unshift(pathNode);
    node = node.previous;
  }

  return path;
}
