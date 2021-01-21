import {
  createElement as h,
} from '../tinyact.js';
import { push } from '../hooks/router.js';
import { useRequest } from '../hooks/request.js';
import { Song } from '../components/song.js';
import { Panel } from '../components/panel.js';

const Album = ({ id, name, img }) => {
  return h('div', { className: 'album', onClick: () => push(`/a/${id}`) },
    h('div', { className: 'album-cover', style: `background-image: url(${img})` }),
    h('h5', { className: 'album-name' }, name),
  );
};

const M = {
  albums: Album,
  songs: Song,
};

const Home = () => {
  const { data } = useRequest('./data/data.json');
  return h('div', { className: 'home' },
    data && data.map(item =>
      h(Panel, { className: item.type, ...item },
        item.list.map(x => h(M[item.type], x))
      )
    )
  );
};

export default Home;