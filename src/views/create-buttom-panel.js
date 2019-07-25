import createMenu from './create-menu.js';
import createControls from './create-controls.js';

import { createElement } from 'utils/common/dom.utils.js';

const TICK_TIME = 80;

export default function createButtomPanel(tick) {
  let objectType = null;

  const panel = createElement('#panel');

  const menu = createMenu({
    onChange: newObjectType => {
      objectType = newObjectType;
    }
  });

  const info = createElement('span#info');

  const controls = createControls(tick, TICK_TIME);

  panel.appendChild(controls.container);

  panel.appendChild(info);

  panel.appendChild(menu);

  return {
    element: panel,
    updateTileInfo(text) {
      info.innerHTML = text;
    },
    get objectType() {
      return objectType;
    }
  };
}
