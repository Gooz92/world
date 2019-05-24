import * as domUtils from '../dom.utils.js';
import { equal } from '../assertion.js';

describe('domUtils', function () {

  describe('createElement', function () {
    const createElement = domUtils.createElement;

    it('create html element with given tag name', () => {
      const tagName = 'div';
      const element = createElement(tagName);
      equal(element.tagName.toLowerCase(), tagName);
    });

    it('create html element with given className', () => {
      const className = 'title';
      const caption = createElement('h1', { className });

      equal(caption.className, className);
    });

    it('create element with given styles', () => {
      const style = {
        backgroundColor: 'red',
        width: '40px',
        height: '30px'
      };

      const redRectangle = createElement('div', { style });

      Object.keys(style)
        .forEach(key => equal(redRectangle.style[key], style[key]));

    });

    it('auto-detect attributes', () => {
      // htmlFor property reflects 'for' attribute
      const id = 'name';
      const label = createElement('label', { for: id });

      equal(label.htmlFor, id);
    });

    it('should assign data attributes', () => {
      const x = 12, y = 2;

      const cell = createElement('div', {
        dataset: { x, y }
      });

      const xAttr = cell.getAttribute('data-x');
      const yAttr = cell.getAttribute('data-y');

      equal(xAttr, x.toString());
      equal(yAttr, y.toString());
    });

    it('can create elements with children', () => {
      const child = createElement('div');
      const parent = createElement('div', [ child ]);

      equal(parent.firstChild, child);
    });

  });

});
