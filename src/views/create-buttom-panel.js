import createMenu from './create-menu.js';
import createControls from './create-controls.js';

import { createElement } from 'utils/common/dom.utils.js';

const presentors = [
  tree => 'tree',
  person => person.name + ' : ' + person.strategyName
];

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

  const selectionInfo = createElement('span#selection-info');

  const controls = createControls(tick, TICK_TIME);

  panel.appendChild(controls.container);

  panel.appendChild(info);

  panel.appendChild(selectionInfo);

  panel.appendChild(menu);

  return {
    element: panel,
    updateTileInfo(text) {
      info.innerHTML = text;
    },
    updateSelectionInfo(selection) {

      if (!selection) {
        selectionInfo.innerHTML = '';
        return;
      }

      const [ x, y ] = selection.position;
      const object = selection.object;
      // TODO
      selectionInfo.innerHTML = `${x};${y} - ${presentors[object.type.id - 2](object)}`;
    },
    get objectType() {
      return objectType;
    }
  };
}
