const PATTERN = /^(?:arrow)?(up|down|left|right)$/i;

export default function getArrowKeyCode(key) {
  const direction = PATTERN.exec(key);
  return direction ? direction[1].toLowerCase() : null;
}
