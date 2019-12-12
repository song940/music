import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory
} from 'react-router-dom';

import './index.css';

const { useState, useEffect } = React;

const AlbumPage = (props) => {
  console.log(props);
  return (
    <Panel>
      <List>
        {
          songs.map((song, i) => <Song key={i} song={song} />)
        }
      </List>
    </Panel>
  )
}

const Header = () => {
  return (
    <div className="header">
      <form action="" >
        <input name="q" placeholder="Type keyword to search ..." />
      </form>
    </div>
  );
};

const Banner = () => {
  return (
    <ul className="banner" >
      <li></li>
    </ul>
  );
};

const Album = ({ album }) => {
  const { id, title, img } = album;
  const { push } = useHistory();
  return (
    <div className="album" onClick={() => push(`/${id}`)} >
      <div className="album-cover" style={{ backgroundImage: `url(${img})` }} ></div>
      <h5 className="album-name" >{title}</h5>
    </div>
  );
};

const Song = ({ song, play }) => {
  const { id, name, artist, album } = song;
  return (
    <div className="song" onClick={() => play(song)} >
      <div>
        <h4 className="song-title" >{name}</h4>
        <p className="song-info">{artist.map(x => x.name).join('/')} - {album.name}</p>
      </div>
    </div>
  );
};

const Panel = ({ title, children }) => {
  return (
    <div className={`panel`} >
      <h3 className="panel-title" >{title}</h3>
      <div className="panel-content" >{children}</div>
    </div>
  );
};

const List = ({ children }) => {
  return (
    <ul className="list" >{children}</ul>
  );
};

const album1 = {
  id: 1,
  title: '看见',
  img: 'https://inews.gtimg.com/newsapp_match/0/5820332145/0'
};


const album2 = {
  id: 2,
  title: '我爱南京',
  img: 'https://inews.gtimg.com/newsapp_match/0/3497031697/0'
};

const album3 = {
  id: 3,
  title: '梵高先生',
  img: 'https://inews.gtimg.com/newsapp_match/0/5820332143/0'
};

const albums = [
  album1,
  album2,
  album3,
  album2,
  album3,
  album1,
  album2,
];

const Progress = () => {
  return (
    <div className="progress">
      <div className="progress-bar"></div>
    </div>
  );
};

const Player = ({ song }) => {
  const { id, title, artist, url, album = {} } = song || {};
  if (title) {
    document.title = `${title} - ${artist}`;
  }
  return (
    <div className="player" >
      <div className="player-album" style={{ backgroundImage: `url(${album.img})` }} ></div>
      <div className="player-content">
        <h4 className="player-title">{title}</h4>
        <span>{artist} - {album.title}</span>
        <audio autoPlay src={url} />
      </div>
      <Progress />
    </div>
  );
};

const Home = () => {
  const [current, play] = useState({});
  const [ songs, setSongs ] = useState([]);
  useEffect(() => {
    fetch('./data/data.json')
    .then(res => res.json())
    .then(setSongs);
  }, []);
  return (
    <div>
      <Header />
      <Banner />
      <Panel title="推荐歌单" >
        {
          albums.map((album, i) => <Album key={i} album={album} />)
        }
      </Panel>
      <Panel title="最新专辑" >
        {
          albums.map((album, i) => <Album key={i} album={album} />)
        }
      </Panel>
      <Panel title="热门歌曲" >
        <List>
          {
            songs.map((song, i) => <Song key={i} song={song} play={play} />)
          }
        </List>
      </Panel>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/:id" children={<AlbumPage />} />
        <Route path="/" children={<Home />} />
      </Switch>
    </Router>
  )
};


ReactDOM.render(<App />, document.getElementById('app'))