import { isFunction } from './utils/is.utils.js';

import world from './views/world.js';
import randomTest from './views/random-test.js';
import viewDistance from './views/view-distance.js';
import viewPath from './views/view-path.js'
import patrols from './views/patrols.js'

const routes = {
  w: world,
  r: randomTest,
  d: viewDistance,
  p: viewPath,
  patrols
};

let currentRoute;

const defaultLeave = () => {
  document.body.innerHTML = '';
};

function run() {
  if (currentRoute && currentRoute.leave) currentRoute.leave();
  const routeName = location.hash.substr(1) || 'w';
  currentRoute = routes[routeName];

  if (isFunction(currentRoute)) {
    const enter = currentRoute;
    currentRoute = { enter, leave: defaultLeave };
  }

  currentRoute.enter();
}

run();

window.onhashchange = run;
