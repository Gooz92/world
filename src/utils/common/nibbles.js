// 15 < MAGIC_NUMBER < 64

const DEFAULT_TAIL_2_TAG = 42;

function nibblesTrio2Letters(one, two, three) {
  return [
    one << 2 | two >> 2,
    two << 4 & 48 | three
  ];
}

function lettersPairToNibbles(first, second) {
  return [
    first >> 2,
    first << 2 & 12 | second >> 4,
    second & 15
  ];
}

// 15 < tail2Tag < 64
function nibbles2r64(nibbles, tail2Tag = DEFAULT_TAIL_2_TAG) {
  var tail = nibbles.length % 3, r64 = [], i;

  for (i = 0; i < nibbles.length - tail; i += 3) {
    r64 = r64.concat(nibblesTrio2Letters(nibbles[i], nibbles[i + 1], nibbles[i + 2]));
  }

  if (tail === 1) {
    r64.push(nibbles[nibbles.length - 1]);
  }

  if (tail === 2) {
    const twoR64 = nibblesTrio2Letters(nibbles[nibbles.length - 2], nibbles[nibbles.length - 1], 0);
    r64.push(twoR64[0], twoR64[1], tail2Tag);
  }

  return r64;
}

function r64ToNibbles(r64) {
  const nibbles = [], tailLength = r64.length % 2;

  for (let i = 0; i < r64.length - tailLength; i += 2) {
    nibbles = nibbles.concat(lettersPairToNibbles(r64[i], r64[i + 1]));
  }

  if (tailLength === 1) {
    if (r64[r64.length - 1] < 16) nibbles.push(r64[r64.length - 1]);
    else nibbles.pop(); // remove tail2Tag
  }

  return nibbles;
}

module.exports = {
  r64ToNibbles,
  nibbles2r64
};
