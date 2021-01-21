import { createElement as h } from '../tinyact.js';
import { useRequest } from '../hooks/request.js';
import { Song } from '../components/song.js';

const Album = ({ id }) => {
  console.log('Album', id);
  const { data } = useRequest(`/data/albums/6.json`);
  if (!data) return;
  return h('div', { key: "album" },
    h('h2', null, data.name),
    data.list.map(song => h(Song, song))
  );
};

export default Album;