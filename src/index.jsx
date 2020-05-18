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

const Home = () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    fetch('./data/data.json')
      .then(res => res.json())
      .then(setList);
  }, []);
  const render = ({ type, list }) => {
    return list.map((item, i) => {
      switch (type) {
        case 'songs':
          return <Song key={i} song={item} />;
        case 'albums':
          return <Album key={i} album={item} />;
      }
    })
  };
  return (
    <div>
      <Header />
      <Banner />
      {
        list && list.map((item, i) => (
          <Panel key={i} title={item.title} >{render(item)}</Panel>
        ))
      }
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