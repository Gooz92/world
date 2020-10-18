export function time(label, fn) {
  console.time(label);
  const result = fn();
  console.timeEnd(label);
  return result;
}
