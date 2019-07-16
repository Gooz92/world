import Direction from 'model/Direction.enum.js';
import { last } from 'utils/common/array.utils.js';

export default function compressPath(path) {

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
