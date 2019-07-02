import { getIndex } from './math.utils.js';

export default function splitInChunks(tiles, chunkSize) {
  const chunks = [];

  const chunkW = Math.ceil(tiles[0].length / chunkSize);
  const chunkH = Math.ceil(tiles.length / chunkSize);

  for (let y = 0; y < tiles.length; y++) {
    const chunkY = Math.floor(y / chunkSize);
    for (let x = 0; x < tiles[y].length; x++) {
      const chunkX = Math.floor(x / chunkSize);
      const chunkIndex = getIndex(chunkX, chunkY, chunkW, chunkH);

      if (!chunks[chunkIndex]) {
        chunks[chunkIndex] = { tiles: [] };
      }

      chunks[chunkIndex].tiles.push(tiles[y][x]);
    }
  }

  return chunks;
}