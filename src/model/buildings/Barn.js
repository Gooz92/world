import ObjectType from 'model/ObjectType.enum.js';
import Orientation from 'model/Orientation.enum.js';
import BarnData from 'data/barn.js';

export default class Barn {

  static TYPE = ObjectType.BUILDING;

  static WIDTH = 8;
  static HEIGHT = 10;

  static FOOTPRINT = BarnData.footprint;

  constructor(x, y, orientation = Orientation.SOUTH) {
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
