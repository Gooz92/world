export const lowerFirst = str => (
  str.charAt(0).toLowerCase() + str.substr(1)
);

export const upperFirst = str => (
  str.charAt(0).toUpperCase() + str.substr(1)
);

export const camelCase = (str, separator = '_') => {
  const words = str.split(separator).map(world => world.toLowerCase());
  const first = words.shift();

  return first + words.map(upperFirst).join('');
};

