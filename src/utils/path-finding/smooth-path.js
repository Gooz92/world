import { last } from 'utils/common/array.utils.js';
import interpolate from '../../interpolate.js';

// assumption: movement cost is const
export default function smoothPath(path, isTilePassable) {
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
    }
  }

  smoothed.push(last(path));

  const result = [];

  for (let i = 0; i < smoothed.length - 1; i++) {
    const [ x0, y0 ] = smoothed[i];
    const [ x1, y1 ] = smoothed[i + 1];
    const line = interpolate(x0, y0, x1, y1);
    result.push(...line);
  }

  return result;
}
