import Direction from 'model/Direction.enum.js';
import { last } from 'utils/common/array.utils.js';
import interpolate from '../../interpolate.js';
import { getCycleCoordinate } from 'utils/common/math.utils.js';

export function backtracePath(node) {
  const path = [];

  let direction = node.direction, isControl = true;

  do {

    if (isControl || !node.previous.previous) {

      path.unshift({
        direction: node.direction,
        position: node.position
      });
    }

    isControl = direction !== node.previous.direction;

    if (isControl) {
      direction = node.previous.direction;
    }

    node = node.previous;
  } while (node.previous);

  return path;
}

// assumption: movement cost is const
export function smoothPath(path, isTilePassable, width, height) {
  const smoothed = [ path[0] ];

  let start = path[0];

  for (let i = 0; i < path.length - 2; i++) {
    let [ x0, y0 ] = start.position;
    let [ x1, y1 ] = path[i + 2].position;

    const dx = Math.sign(x1 - x0);
    const dy = Math.sign(y1 - y0);

    if (dx !== 0 && dx === -start.direction.dx) {
      if (dx > 0) {
        x1 += width;
      } else if (dx < 0) {
        x1 -= width;
      }
    }

    if (dy !== 0 && dy === -start.direction.dy) {
      if (dy > 0) {
        y1 -= height;
      } else {
        y1 += height;
      }
    }

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
      start = path[i];
      smoothed.push(start);
    }
  }

  smoothed.push(last(path));

  return smoothed;
}

// TODO: remove backtracing and compressing is merged into one function
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
    let [ x0, y0 ] = path[i].position;
    let [ x1, y1 ] = path[i + 1].position;

    const direction = Direction.fromPoints(path[i].position, path[i + 1].position);

    if (direction.dx !== 0 && direction.dx === -path[i].direction.dx) {
      if (direction.dx > 0) {
        x1 -= width;
      } else if (direction.dx < 0) {
        x1 += width;
      }
    }

    if (direction.dy !== 0 && direction.dy === -path[i].direction.dy) {
      if (direction.dy > 0) {
        y1 -= height;
      } else {
        y1 += height;
      }
    }

    const segment = interpolate(x0, y0, x1, y1);

    segment.forEach(([ x, y ]) => {
      expanded.push([
        getCycleCoordinate(x, width),
        getCycleCoordinate(y, height)
      ]);
    });

  }

  return expanded;
}

