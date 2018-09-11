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

    it('create html element with given className', () => {
      const className = 'title';
      const caption = createElement('h1', { className });

      assert.strictEqual(caption.className, className);
    });

    it('create element with given styles', () => {
      const style = {
        backgroundColor: 'red',
        width: '40px',
        height: '30px'
      };

      const redRectangle = createElement('div', { style });

      assert.include(redRectangle.style, style);
    });

    it('auto-detect attributes', () => {
      // htmlFor property reflects 'for' attribute
      const id = 'name';
      const label = createElement('label', { for: id });

      assert.strictEqual(label.htmlFor, id);
    });

  });

});
