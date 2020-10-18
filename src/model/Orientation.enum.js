import createEnum from 'utils/create-enum.js';
import { noop } from 'utils/common/fn.utils.js';
import { getItem } from 'utils/common/array.utils.js';

const Orientation = createEnum(noop, {
  NORTH: [ 0, - 1 ],
  EAST: [ 1, 0 ],
  SOUTH: [ 0, 1 ],
  WEST: [ -1, 0 ]
});

Orientation.prototype.rotate = function (offset) {
  const selfIndex = Orientation.members.indexOf(this);
  return getItem(Orientation.members, selfIndex + offset);
};

export default Orientation;
