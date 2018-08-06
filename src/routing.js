import world from './views/world.js';
import randomTest from './views/random-test.js';
import viewDistance from './views/view-distance.js';

const routes = {
  w: world,
  r: randomTest,
  d: viewDistance
};

let currentRoute;

function run() {
  if (currentRoute && currentRoute.leave) currentRoute.leave();
  const routeName = location.hash.substr(1) || 'w';
  currentRoute = routes[routeName];
  currentRoute.enter();
}

run();

window.onhashchange = run;
