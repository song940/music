import { createElement as h } from '../tinyact.js';

export const Song = ({ name, album, artist }) => {
    return h('div', {},
      h('h4', null, name),
      h('p', null, `${artist.map(x => x.name).join(' / ')} ${album.name}`),
    );
  };
