import { generateArray } from '../utils/array.utils.js';
import { distributionRandom } from '../utils/random.utils.js';
import ObjectType from './ObjectType.js';

export default class World {

  static createRandomWorld(width, height, objectDistribution) {
    const random = distributionRandom(objectDistribution);
    const actors = [];

    const tiles = generateArray(height, (y, tls) => (
      generateArray(width, x => {
        const getNextObject = random();
        const object = getNextObject(x, y, tls);

        if (object && object.type === ObjectType.PERSON) {
          actors.push(object);
        }

        return { object };
      })
    ));

    return new World(tiles, actors);
  }

  constructor(tiles, actors) {
    this.tiles = tiles;
    this.actors = actors;
  }

  tick() {
    return this.actors
      .map(actor => actor.act());
  }
}
