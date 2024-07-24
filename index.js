import { ready } from 'https://lsong.org/scripts/dom.js';
import { serialize } from 'https://lsong.org/scripts/form.js';
import { h, render, useState, useEffect, List, ListItem } from 'https://lsong.org/scripts/react/index.js';
import { playlist_top, playlist_detail, lyric, search, get_song_url } from './163-music.js';
import { parse, cue } from 'https://lsong.org/lyric.js/index.js';

const audio = new Audio();

const playTrack = async id => {
  const data = await lyric(id);
  const lrc = parse(data.lyric.lyric);
  const url = await get_song_url(id);
  const update = cue(lrc.lines, console.log);
  audio.ontimeupdate = () => update(audio.currentTime);
  audio.src = url;
  audio.play();
};

const Player = ({ track, prev, next }) => {
  useEffect(() => {
    playTrack(track.id);
    console.log(track);
    const meta = new MediaMetadata({
      title: track.name,
      artist: track.ar[0].name,
      album: track.al.name,
      artwork: [
        {
          type: "image/png",
          src: track.al.picUrl,
        },
      ]
    });
    audio.onended = () => next();
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = meta;
      navigator.mediaSession.setActionHandler("play", () => audio.play());
      navigator.mediaSession.setActionHandler("pause", () => audio.pause());
      navigator.mediaSession.setActionHandler("previoustrack", prev);
      navigator.mediaSession.setActionHandler("nexttrack", next);
    }
  }, [track]);
  const info = () => {
    console.log('info', track);
  };
  const setVolume = e => {
    const volume = ((60 - e.offsetY) / 60);
    console.log('volume', volume);
    audio.volume = volume;
  };
  const play = () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };
  if (!track) return;
  return h('div', { className: 'player' }, [
    h('div', { className: 'player-container' }, [
      h('div', { className: "player-left" }, [
        h('img', { src: track.al.picUrl, onClick: info }),
        h('div', { className: 'player-info' }, [
          h('h4', { className: 'player-title' }, track.name),
          h('span', { className: 'player-artist' }, track.ar.map(artist => artist.name).join('/') + ' - ' + track.al.name),
        ]),
      ]),
      h('div', { className: 'player-prev', onClick: () => prev() }, "⏮"),
      h('div', { className: 'player-play', onClick: () => play() }, audio.paused ? "▶️" : "⏸"),
      h('div', { className: 'player-next', onClick: () => next() }, "⏭"),
      h('div', { className: 'player-volume', onClick: setVolume }),
    ]),
  ]);
};

const formatDuration = duration => {
  duration = Math.floor(duration / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const Track = ({ id, track, onClick }) => {
  return (
    h('div', { className: 'track', onClick }, [
      h('span', { className: 'track-id' }, id),
      h('h4', { className: 'track-title' }, track.name),
      h('span', { className: 'track-artist' }, (track.ar || track.artists).map(artist => artist.name).join('/') + ' - ' + (track.al || track.album).name),
      h('span', { className: 'track-duration' }, formatDuration(track.dt || track.duration)),
    ])
  );
};

const Playlist = ({ onClick, playlist }) => {
  if (!playlist) return;
  return h('div', {}, [
    h('h3', null, playlist.name),
    h(List, {}, playlist.tracks.map((track, i) =>
      h(ListItem, null, h(Track, { id: i + 1, track, onClick: () => onClick(track, i, playlist) }))
    )),
  ]);
};

const Album = ({ album, onClick }) => {
  return h('div', { className: 'album', onClick: () => onClick && onClick(album) }, [
    h('img', { src: album.coverImgUrl }),
    h('h4', { className: 'album-title' }, album.name),
  ]);
};

const Albums = ({ onClick, albums }) => {
  if (!albums) return;
  return h('div', { className: 'albums' }, [
    h('h3', null, '最新专辑'),
    h('ul', {}, albums.map(album => h('li', {}, h(Album, { album, onClick })))),
  ]);
};

const Search = ({ onSearch }) => {
  const onSubmit = async e => {
    e.preventDefault();
    const { q: keyword } = serialize(e.target);
    onSearch ? onSearch(keyword) : h();
  };
  return h('form', { className: 'search', onSubmit }, [
    h('input', { type: 'text', name: 'q', placeholder: 'Search song and/or playlist, etc.' }),
  ]);
};

const App = () => {
  const [playlistId, setPlaylistId] = useState(2905047708);
  const [currentSong, setCurrentSong] = useState(-1);
  const [track, setTrack] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  useEffect(() => {
    playlist_detail(playlistId).then(setPlaylist);
  }, [playlistId]);
  useEffect(() => {
    playlist_top().then(setAlbums);
  }, []);
  useEffect(() => {
    if (playlist && currentSong != -1) {
      setTrack(playlist.tracks[currentSong]);
    }
  }, [currentSong]);
  const onSearch = keyword => {
    search(keyword, 1000).then(({ playlists }) => setAlbums(playlists));
    search(keyword, 1).then(({ songs: tracks }) => {
      setPlaylist({ name: '搜索结果: ' + keyword, tracks });
    });
  };
  const prev = () => setCurrentSong(currentSong - 1);
  const next = () => setCurrentSong(currentSong + 1);
  const onClickTrack = async (_, i) => setCurrentSong(i);
  const onClickPlaylist = playlist => setPlaylistId(playlist.id);
  return [
    h(Search, { onSearch }),
    h(Albums, { onClick: onClickPlaylist, albums }),
    h(Playlist, { onClick: onClickTrack, playlist }),
    track && h(Player, { track, prev, next }),
  ]
}

ready(() => {
  const app = document.getElementById('app');
  render(h(App), app);
});