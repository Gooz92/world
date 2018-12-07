import { generateArray } from '../utils/array.utils.js';
import { distributionRandom } from '../utils/random.utils.js';
import ObjectType from './ObjectType.js';
import diamondSquare from 'utils/diamond-square.js';

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

  constructor(tiles, actors = []) {
    this.tiles = tiles;
    this.actors = actors;
  }

  placeTrees() {
    const treeMap = diamondSquare(42);

    for (let i = 0; i < treeMap.length; i++) {
      for (let j = 0; j < treeMap[i].length; j++) {
        if (treeMap[i][j]) {
          this.tiles[i][j].object = {type: ObjectType.TREE };
        }
      }
    }
  }

  tick() {
    return this.actors
      .map(actor => actor.act());
  }
}
