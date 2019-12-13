import ObjectType from 'model/ObjectType.enum.js';
import Orientation from 'model/Orientation.enum.js';

export default class Barn {

  static TYPE = ObjectType.BUILDING;

  static WIDTH = 8;
  static HEIGHT = 10;

  constructor(x, y, orientation = Orientation.NORTH) {
    this.x = x;
    this.y = y;

    this.orientation = orientation;

    // TODO ?
    this.width = Barn.WIDTH;
    this.height = Barn.HEIGHT;
  }

  get type() {
    return Barn.TYPE;
  }
}
