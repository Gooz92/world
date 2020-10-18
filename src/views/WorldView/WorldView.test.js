import WorldView from './WorldView.js';
import { getObject, noop } from 'utils/common/fn.utils.js';
import { generateArray } from 'utils/common/array.utils.js';
import World from 'model/world';
import { equal, deepEqual, isFalse, isTrue } from 'utils/assertion.js';
import ObjectType from 'model/ObjectType.enum.js';

// more like integration test
describe('WorldView', function () {

  describe('select', function () {

    let worldView;

    beforeEach(() => {
      const tiles = generateArray(9, 12, getObject);
      const world = new World(tiles);

      const viewportStub = {
        size: [ 4, 3 ],
        position: [ 1, 2 ],
        drawSelection: noop,
        refreshTile: noop
      };

      worldView = new WorldView(world, viewportStub);
    });

    it('store and return selection', () => {
      const x = 2, y = 3;

      const teapot = worldView.place(x, y, { name: 'teapot' });

      const selection = worldView.select(x, y);

      equal(worldView.selection, selection);
      equal(selection.object, teapot);

      const position = worldView.getGlobalPosition(x, y);
      deepEqual(selection.position, position);
    });

  });

  describe('isSelectionMoved()', function () {

    let worldView;

    beforeEach(() => {
      const tiles = generateArray(9, 12, getObject);
      const world = new World(tiles);

      const viewportStub = {
        size: [ 4, 3 ],
        position: [ 1, 2 ],
        drawSelection: noop,
        refreshTile: noop
      };

      worldView = new WorldView(world, viewportStub);
    });

    it('return false if there is no selection', () => {
      isFalse(worldView.isSelectionMoved());
    });

    it('return false if selected object has no position (can not moved)', () => {
      const x = 3, y = 4;
      worldView.place(x, y, ObjectType.TREE);
      worldView.select(x, y);

      isFalse(worldView.isSelectionMoved());
    });

    it('return true if selected object is moved', () => {
      const x = 2, y = 3;
      const walker = worldView.place(x, y, ObjectType.PERSON);
      worldView.select(x, y);

      walker.moveTo([ x, y + 1 ]);

      isTrue(worldView.isSelectionMoved());
    });

    it('return false if selected object is not moved', () => {
      const x = 2, y = 3;
      worldView.place(x, y, ObjectType.PERSON);
      worldView.select(x, y);

      isFalse(worldView.isSelectionMoved());
    });

  });

});
