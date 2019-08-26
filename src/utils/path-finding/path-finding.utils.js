import { last } from 'utils/common/array.utils.js';
import interpolate from '../../interpolate.js';
import { getCycleCoordinate } from 'utils/common/math.utils.js';
import Direction from 'model/Direction.enum.js';

export function postProcess(node, isTilePassable, width, height) {

  if (!node.previous) {
    return [];
  }

  const path = backtracePath(node);
  const compressedPath = compressPath(path);
  const smoothedPath = smoothPath(compressedPath, isTilePassable, width, height);
  const expandedPath = expandPath(smoothedPath, width, height);

  return expandedPath;
}

export function compressPath(path) {

  if (path.length < 2) {
    return path;
  }

  const compressed = [ path[0] ];

  if (path[0].direction !== path[1].direction) {
    compressed[0].direction = path[1].direction;
  }

  for (let i = 1; i < path.length - 1; i++) {
    if (path[i].direction !== path[i + 1].direction) {
      compressed.push({
        position: path[i].position,
        direction: path[i + 1].direction
      });
    }
  }

  compressed.push(last(path));

  return compressed;
}

export function backtracePath(node) {

  const path = [];

  do {
    path.unshift({
      position: node.position,
      direction: node.direction
    });
    node = node.previous;
  } while (node.previous);

  return path;
}

export function getNextCoordinate(a, b, d0, bound) {
  const d = Math.sign(b - a);

  if (d === 0) {
    return b;
  }

  if (d === -d0) {
    return b - d * bound;
  }

  return b;
}

// assumption: movement cost is const
export function smoothPath(path, isTilePassable, width, height) {

  if (path.length < 3) {
    return path;
  }

  const smoothed = [ path[0] ];

  let start = path[0];

  for (let i = 2; i < path.length; i++) {
    let [ x0, y0 ] = start.position;
    let [ x1, y1 ] = path[i].position;

    x1 = getNextCoordinate(x0, x1, start.direction.dx, width);
    y1 = getNextCoordinate(y0, y1, start.direction.dy, height);

    const line = interpolate(x0, y0, x1, y1);

    let blocked = false;
    for (let i = 1; i < line.length; i++) {
      const x = getCycleCoordinate(line[i][0], width);
      const y = getCycleCoordinate(line[i][1], height);

      if (!isTilePassable(x, y)) {
        blocked = true;
        break;
      }
    }

    if (blocked) {
      start = path[i - 1];
      smoothed.push(start);
    }
  }

  smoothed.push(last(path));

  return smoothed;
}

export function expandPath(path, width, height) {

  if (path.length < 2) {
    return path;
  }

  const expanded = [];

  for (let i = 0; i < path.length - 1; i++) {
    let [ x0, y0 ] = path[i].position;
    let [ x1, y1 ] = path[i + 1].position;

    x1 = getNextCoordinate(x0, x1, path[i].direction.dx, width);
    y1 = getNextCoordinate(y0, y1, path[i].direction.dy, height);

    const segment = interpolate(x0, y0, x1, y1);

    expanded.push({
      direction: path[i].direction,
      position: [
        getCycleCoordinate(x0, width),
        getCycleCoordinate(y0, height)
      ]
    });

    for (let i = 1; i < segment.length; i++) {
      const [ x, y ] = segment[i];
      expanded.push({
        direction: Direction.fromPoints(segment[i - 1], segment[i]),
        position: [
          getCycleCoordinate(x, width),
          getCycleCoordinate(y, height)
        ]
      });
    }
  }

  return expanded;
}

