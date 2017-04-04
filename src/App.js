import React, { PureComponent } from 'react';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';

import Controls from './components/Controls';
import Playlist from './components/Playlist';
import ProgressIndicator from './components/ProgressIndicator';
import Sliders from './components/Sliders';
import Time from './components/Time';

import lastfm from './api/lastfm';

const muiTheme = getMuiTheme({
  slider: {
    selectionColor: 'white',
    rippleColor: 'white',
  },
});

function yqlQuery(url) {
  let resultUrl = url.replace('https://', 'http://'); // last.fm bug workaround
  let query = `select data-youtube-id from html where url="${resultUrl}" and compat="html5" and xpath='//a[@data-youtube-id]' limit 1`;
  return `https://query.yahooapis.com/v1/public/yql?q=${encodeURIComponent(query)}&format=json&diagnostics=false`;
}

const searchTypeToApiCall = {
  artist: lastfm.getTopTracksByArtist,
  tag: lastfm.getTopTracksByTag,
};

export default class App extends PureComponent {

  constructor(props) {
    super(props);
    this.handleTextInput = this.handleTextInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleVideoSelect = this.handleVideoSelect.bind(this);
    this.pausePlayToggle = this.pausePlayToggle.bind(this);
    this.playerStateChange = this.playerStateChange.bind(this);
    this.handleTimeSeek = this.handleTimeSeek.bind(this);
    this.handleTimeDragStart = this.handleTimeDragStart.bind(this);
    this.handleTimeDragStop = this.handleTimeDragStop.bind(this);
    this.handleTimeSeek = this.handleTimeSeek.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.changeSearchType = this.changeSearchType.bind(this);
  }

  state = {
    tracks: [],
    videos: [],
    searchQuery: '',
    activeIndex: null,
    playing: false,
    currentTime: 0,
    duration: 0,
    loading: false,
    dragging: false,
    draggingValue: null,
    volume: 100,
    searchType: 'artist',
    page: 1,
    lastPage: false,
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
    window.onscroll = () => {
      if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight) && !this.state.loading) {
        this.handleScrollToBottom();
      }
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

  handleSearch() {
    this.setState({
      loading: true,
    });
    const apiCall = searchTypeToApiCall[this.state.searchType];
    apiCall(this.state.searchQuery)
      .then((tracks) => {
        this.setState({
          tracks: tracks,
          activeIndex: null,
          loading: false,
          page: 1,
          lastPage: false,
        });
      })
      .catch((ex) => {
        console.error(ex);
        this.setState({
          loading: false,
        });
      });
  }

  handleScrollToBottom() {
    if (this.state.tracks && this.state.lastPage === true) {
      return false;
    }
    this.setState({
      loading: true,
    });
    const apiCall = searchTypeToApiCall[this.state.searchType];
    apiCall(this.state.searchQuery, this.state.page + 1)
      .then((tracks) => {
        if (tracks.length > 0) {
          this.setState({
            tracks: [...this.state.tracks, ...tracks],
            loading: false,
            page: this.state.page + 1,
          });
        } else {
          this.setState({
            loading: false,
            lastPage: true,
          });
        }
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
      searchQuery: e.target.value,
    });
  }

  handleTextInput(e) {
    if (e.keyCode === 13) {
      this.handleSearch();
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
        volume: this._player.getVolume(),
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
      volume: value,
    });
    this._player.setVolume(value);
  }

  changeSearchType(event, key, value) {
    this.setState({
      searchType: value,
    });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <ProgressIndicator show={this.state.loading} />
          <AppBar
            style={STYLES.appBar}
            title={
              <Sliders
                currentTime={this.state.currentTime}
                volume={this.state.volume}
                duration={this.state.duration}
                playing={this.state.playing}
                onTimeChange={this.handleTimeSeek}
                onTimeDragStart={this.handleTimeDragStart}
                onTimeDragStop={this.handleTimeDragStop}
                onVolumeChange={this.handleVolumeChange}
              />
            }
            iconElementLeft={
              <div style={STYLES.controlsHolder}>
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
            iconStyleRight={STYLES.rightIcon}
          />
          <Paper style={STYLES.contentWrapper}>
            <div style={STYLES.content}>
              <TextField
                hintText="Your search query"
                value={this.state.searchQuery}
                onChange={this.handleChange}
                onKeyUp={this.handleTextInput}
              />
              <SelectField value={this.state.searchType} onChange={this.changeSearchType}>
                <MenuItem value="artist" primaryText="Artist" />
                <MenuItem value="tag" primaryText="Tag" />
              </SelectField>
              <FlatButton onClick={this.handleSearch} label="Find" />
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

const STYLES = {
  appBar: {
    position: 'fixed',
    left: 15,
    right: 15,
    width: 'auto',
  },
  controlsHolder: {
    display: 'flex',
    flexDirection: 'row'
  },
  rightIcon: {
    textAlign: 'center',
    padding: 14,
  },
  contentWrapper: {
    position: 'relative'
    top: 80,
    marginBottom: 15,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingTop: 10,
  }
};
