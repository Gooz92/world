export const property = propertyName => obj => obj[propertyName];

export const omit = (obj, keys) => (
  Object.keys(obj)
    .reduce((result, key) => (
      keys.includes(key) ? result : { ...result, [key]: obj[key] }
    ), {})
)