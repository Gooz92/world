import createEnum from 'utils/common/create-enum.js';
import { noop } from 'utils/common/fn.utils.js';

export default createEnum(noop, {
  NORTH: [ 0, - 1 ],
  EAST: [ 1, 0 ],
  SOUTH: [ 0, 1 ],
  WEST: [ -1, 0 ],
});
