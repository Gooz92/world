export const noop = () => {};

export const identity = arg => arg;

export const constant = arg => () => arg;
