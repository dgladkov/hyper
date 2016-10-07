import React, { PureComponent } from 'react';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Controls from './components/Controls';
import Playlist from './components/Playlist';
import ProgressIndicator from './components/ProgressIndicator';
import Time from './components/Time';
import Sliders from './components/Sliders';

const LASTFM_API_KEY = '70bc1c39ae330d9cd698b7cc221febb6'; // YOLO
const LASTFM_API_BASEURL = 'http://ws.audioscrobbler.com/2.0/';

const muiTheme = getMuiTheme({
  slider: {
    selectionColor: 'white',
    rippleColor: 'white',
  },
});

function yqlQuery(url) {
  let resultUrl = url.replace('https://', 'http://');
  let query = `select data-youtube-id from html where url="${resultUrl}" and compat="html5" and xpath='//a[@data-youtube-id]' limit 1`;
  return `https://query.yahooapis.com/v1/public/yql?q=${encodeURIComponent(query)}&format=json&diagnostics=false`;
}

export default class App extends PureComponent {

  constructor(props) {
    super(props);
    this.handleTextInput = this.handleTextInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleArtistSearch = this.handleArtistSearch.bind(this);
    this.handleVideoSelect = this.handleVideoSelect.bind(this);
    this.pausePlayToggle = this.pausePlayToggle.bind(this);
    this.playerStateChange = this.playerStateChange.bind(this);
    this.handleTimeSeek = this.handleTimeSeek.bind(this);
    this.handleTimeDragStart = this.handleTimeDragStart.bind(this);
    this.handleTimeDragStop = this.handleTimeDragStop.bind(this);
    this.handleTimeSeek = this.handleTimeSeek.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
  }

  state = {
    tracks: [],
    videos: [],
    artistName: '',
    activeIndex: null,
    playing: false,
    currentTime: 0,
    duration: 0,
    loading: false,
    dragging: false,
    draggingValue: null,
    currentVolume: 100,
  }

  componentDidMount() {
    setInterval(() => {
      if (this.state.playing && !this.state.dragging) {
        this.updateCurrentTime();
      }
    }, 200);
    window.onYouTubeIframeAPIReady = () => {
      this._player = new window.YT.Player('hidden');
      this._player.addEventListener('onStateChange', this.playerStateChange);
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // load video every time active index changes
    if (this.state.activeIndex !== null && prevState.activeIndex !== this.state.activeIndex) {
      let activeVideo = this.state.videos[this.state.activeIndex];
      this._player.loadVideoById(activeVideo);
    }
  }

  componentWillUnmount() {
    this._player.destroy();
  }

  updateCurrentTime() {
    this.setState({
      currentTime: Math.floor(this._player.getCurrentTime()) || 0,
      duration: Math.floor(this._player.getDuration()) || 0,
    });
  }

  handleArtistSearch() {
    this.setState({
      loading: true,
    });
    fetch(`${LASTFM_API_BASEURL}?method=artist.gettoptracks&artist=${this.state.artistName}&api_key=${LASTFM_API_KEY}&format=json`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          tracks: data.toptracks.track,
          videos: [],
          activeIndex: null,
          loading: false,
        });
      })
      .catch((ex) => {
        console.error(ex);
        this.setState({
          loading: false,
        });
      });
  }
  handleChange(e) {
    this.setState({
      artistName: e.target.value,
    });
  }
  handleTextInput(e) {
    if (e.keyCode === 13) {
      this.handleArtistSearch();
    }
  }
  handleVideoSelect(index) {
    if (this.state.videos[index] !== undefined) {
      this.setState({
        activeIndex: index,
      });
      return;
    }
    this.setState({
      loading: true,
    });
    fetch(yqlQuery(this.state.tracks[index].url))
      .then((response) => response.json())
      .then((data) => {
        let videos = this.state.videos.slice();
        videos[index] = data.query.results.a['data-youtube-id'];
        this.setState({
          videos: videos,
          activeIndex: index,
          playing: true,
          loading: false,
          currentTime: 0,
          duration: 0,
        });
      })
      .catch((ex) => {
        console.error(ex);
        this.setState({
          loading: false,
        });
      });
  }

  pausePlayToggle() {
    if (this.state.playing === true) {
      this._player.pauseVideo();
    } else {
      this._player.playVideo();
    }
    this.setState({
      playing: !this.state.playing,
    });
  }
  playerStateChange(event) {
    if (event.data === -1) {
      this.setState({
        currentVolume: this._player.getVolume(),
      });
    }
    if (event.data === window.YT.PlayerState.ENDED) {
      let nextIndex = null;
      if (this.state.activeIndex < this.state.tracks.length - 1) {
        nextIndex = this.state.activeIndex + 1;
      }
      this.handleVideoSelect(nextIndex);
    }
  }
  handleTimeSeek(event, value) {
    this.setState({
      draggingValue: value,
    });
  }
  handleTimeDragStart() {
    this.setState({
      dragging: true,
    });
  }
  handleTimeDragStop() {
    let seekToTime = Math.floor(this.state.duration * this.state.draggingValue);
    this._player.seekTo(seekToTime);
    this.setState({
      currentTime: seekToTime,
      dragging: false,
    });
  }
  handleVolumeChange(event, value) {
    this.setState({
      currentVolume: value,
    });
    this._player.setVolume(value);
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <ProgressIndicator show={this.state.loading} />
          <AppBar
            style={{
              position: 'fixed',
              right: 15,
              left: 15,
              width: 'auto',
            }}
            title={
              <Sliders
                currentTime={this.state.currentTime}
                currentVolume={this.state.currentVolume}
                duration={this.state.duration}
                playing={this.state.playing}
                onTimeChange={this.handleTimeSeek}
                onTimeDragStart={this.handleTimeDragStart}
                onTimeDragStop={this.handleTimeDragStop}
                onVolumeChange={this.handleVolumeChange}
              />
            }
            iconElementLeft={
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <Controls
                  onPlayPauseHandler={this.pausePlayToggle}
                  playing={this.state.playing}
                  lastIndex={this.state.tracks.length - 1}
                  activeIndex={this.state.activeIndex}
                  handleVideoSelect={this.handleVideoSelect}
                />
              </div>
            }
            iconElementRight={
              <Time
                currentTime={this.state.currentTime}
                duration={this.state.duration}
              />
            }
            iconStyleRight={{
              textAlign: 'center',
              padding: 14,
            }}
          />
          <Paper style={{top: 80, marginBottom: 15, position: 'relative'}}>
            <div style={{paddingLeft: 16, paddingTop: 10}}>
              <TextField
                hintText="Type artist name"
                value={this.state.artistName}
                onChange={this.handleChange}
                onKeyUp={this.handleTextInput}
              />
              <FlatButton onClick={this.handleArtistSearch} label="Find" />
            </div>
            <Playlist
              handleVideoSelect={this.handleVideoSelect}
              activeIndex={this.state.activeIndex}
              tracks={this.state.tracks}
              loading={this.state.loading}
            />
          </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}
