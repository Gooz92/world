/*
 *
 *          North
 *
 *        nw  n  ne
 *          \ | /
 *  West  w - @ - e  East
 *          / | \
 *        sw  s  se
 *
 *          South
 */

export default {
  n: [ 0, -1 ],
  ne: [ 1, -1 ],
  e: [ 1, 0 ],
  se: [ 1, 1 ],
  s: [ 0, 1 ],
  sw: [ -1, 1 ],
  w: [ -1, 0 ],
  nw: [ -1, -1 ]
};
