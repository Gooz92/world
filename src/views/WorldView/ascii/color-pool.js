import { randomArrayIterator } from 'utils/common/random.utils.js';

export const COLORS = [
  [
    [ 'red', '#f00' ],
    [ 'green', '#090' ],
    [ 'blue', '#00f' ],
  ],

  [
    [ 'yellow', '#ff0' ]
  ],

  [
    [ 'orange' ],
    [ 'light-blue' ],
    [ 'dark-blue' ],
    [ 'pink' ]
  ]
];

export default function colorPool() {

  let currentPriority = 0, colorIterator = randomArrayIterator(COLORS[0]);

  return () => {
    if (!colorIterator.hasNext()) {
      currentPriority = (currentPriority + 1) % COLORS.length;
      colorIterator = randomArrayIterator(COLORS[currentPriority]);
    }

    return colorIterator.next();
  };
}
