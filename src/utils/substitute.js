const PLACEHOLDER_PATTERN = /(\\?)\{([^\{\}]+)\}/g;

module.exports = function substitute(template, data) {
  return template.replace(PLACEHOLDER_PATTERN, (match, probablySlash, key) => {
    if (probablySlash) {
      return match;
    }

    return data[key];
  });
};
