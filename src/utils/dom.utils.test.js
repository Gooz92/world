import * as domUtils from './dom.utils.js';
import { assert } from 'chai';

describe('domUtils', function () {

  describe('createElement', function () {
    const createElement = domUtils.createElement;

    it('create html element with given tag name', () => {
      const tagName = 'div';
      const element = createElement(tagName);
      assert.strictEqual(element.tagName.toLowerCase(), tagName);
    });
  });

});
