import createElement, { parseQuery } from '../create-element.js';
import { equal } from 'utils/assertion.js';
import deepEqual from 'utils/common/deep-equal.js';

describe('createElement', function () {

  it('create element with given tag name', () => {
    const tagName = 'div';
    const element = createElement(tagName);
    equal(element.tagName.toLowerCase(), tagName);
  });

  it('create element with given className', () => {
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

describe('parseQuery', function () {

  it('default tag is div', () => {
    const { tag } = parseQuery('');
    equal(tag, 'div');
  });

  it('extract tag name', () => {
    const tagName = 'main';
    const { tag } = parseQuery(`${tagName}.container`);
    equal(tag, tagName);
  });

  it('extract single class name', () => {
    const className = 'panel';
    const parsed = parseQuery(`details.${className}`);
    equal(parsed.className, className);
  });

  it('extract list of class names', () => {
    const classes = 'large red square';
    const parsed = parseQuery(`figure.${classes}`);
    equal(parsed.className, classes);
  });

  it('extract id', () => {
    const id = 'header-1';
    const parsed = parseQuery(`header#${id}`);
    equal(parsed.id, id);
  });

  it('exctract tag, id and class list', () => {
    const tag = 'figure';
    const id = 'fig-42';
    const classes = 'small green circle';
    const figure = parseQuery(`${tag}#${id}.${classes}`);
    deepEqual(figure, { tag, id, classes });
  });
});
