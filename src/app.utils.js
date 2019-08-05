import { isUndefined } from 'utils/common/is.utils.js';
import { getSeed } from 'utils/common/random.utils.js';
import { parseParams, stringifyParams } from 'utils/params.js';

export const getLocationHash = () => (
  location.hash.substr(1)
);

function getParams() {
  const paramsStr = getLocationHash();

  const params = parseParams(paramsStr, {
    seed: value => parseInt(value, 36),
    empty: value => !!+value
  });

  if (isUndefined(params.seed)) {
    params.seed = getSeed();
  }

  if (isUndefined(params.empty)) {
    params.empty = false;
  }

  return params;
}

export function paramsHandler(onInput) {

  const params = getParams();

  const stringifiedParams = stringifyParams(params, {
    seed: seed => seed.toString(36),
    empty: e => +e
  });

  // if page will be reloaded without changing hash onhashchange wont fired
  if (stringifiedParams === getLocationHash()) {
    onInput(params);
  }

  location.hash = stringifiedParams;

  window.onhashchange = () => {

    const params = getParams();

    const stringifiedParams = stringifyParams(params, {
      seed: seed => seed.toString(36),
      empty: e => +e
    });

    if (stringifiedParams !== getLocationHash()) {
      location.hash = stringifiedParams;
    } else {
      onInput(params);
    }
  };
}

export function getViewportSize(container, cellSize) {
  const { width, height } = container.getBoundingClientRect();

  return [
    Math.ceil(width / cellSize),
    Math.ceil(height / cellSize)
  ];
}
