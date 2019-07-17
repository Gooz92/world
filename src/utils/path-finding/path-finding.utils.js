import Direction from 'model/Direction.enum.js';
import { last } from 'utils/common/array.utils.js';
import interpolate from '../../interpolate.js';

const getPosition = node => node.position;

export function backtracePath(node, getPathNode = getPosition) {
  const path = [];

  while (node.previous) {
    const pathNode = getPathNode(node);
    path.unshift(pathNode);
    node = node.previous;
  }

  return path;
}

export function compressPath(path) {

  const compressed = [ path[0] ];

  let start = path[0];
  let end = path[1];

  let currentDirection = Direction.fromPoints(start, end);

  for (let i = 2; i < path.length - 1; i++) {
    start = path[i];
    end = path[i + 1];

    const newDirection = Direction.fromPoints(start, end);

    if (newDirection !== currentDirection) {
      currentDirection = newDirection;
      compressed.push(start);
    }
  }

  compressed.push(last(path));

  return compressed;
}

export function expandPath(path, width, height) {
  const expanded = [];

  for (let i = 0; i < path.length - 1; i++) {
    const [ x0, y0 ] = path[i];
    const [ x1, y1 ] = path[i + 1];

    const segment = interpolate(x0, y0, x1, y1);

    expanded.push(...segment);
  }

  return expanded;
}

// assumption: movement cost is const
export function smoothPath(path, isTilePassable) {
  const smoothed = [ path[0] ];

  let start = path[0];

  for (let i = 0; i < path.length - 2; i++) {
    const [ x0, y0 ] = start;
    const [ x1, y1 ] = path[i + 2];

    const line = interpolate(x0, y0, x1, y1);

    let blocked = false;
    for (let i = 1; i < line.length; i++) {
      const [ x, y ] = line[i];
      if (!isTilePassable(x, y)) {
        blocked = true;
        break;
      }
    }

    if (blocked) {
      start = path[i];
      smoothed.push(start);
    }
  }

  smoothed.push(last(path));

  return smoothed;
}
