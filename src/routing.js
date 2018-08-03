import world from './world.js';
import randomTest from './random-test.js';

const routes = {
  w: world,
  r: randomTest
};

function run() {
  const routeName = location.hash.substr(1) || 'w';
  routes[routeName]();
}

run();

window.onhashchange = run;
