import {
  ready,
  querySelector as $
} from 'https://lsong.org/scripts/dom.js';
import {
  render,
  createElement as h,
} from './tinyact.js';
import { useRouter, push } from './hooks/router.js';
import Home from './pages/home.js';
import Album from './pages/album.js';

const routes = {
  '/': () => h(Home),
  '/a/:id': ({ id }) => h(Album, { id }),
};

const App = () => useRouter(routes);

ready(() => {
  render(h(App), $('#app'));
});