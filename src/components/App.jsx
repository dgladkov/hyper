import React from 'react';
import reactMixin from 'react-mixin';
import {
    AppBar,
    FlatButton,
    Styles,
    TextField,
} from 'material-ui';
import Controls from './Controls';
import Playlist from './Playlist';
import Time from './Time';
import TimeSlider from './TimeSlider';

let ThemeManager = new Styles.ThemeManager();

const LASTFM_API_KEY = '70bc1c39ae330d9cd698b7cc221febb6';
const LASTFM_API_BASE = 'http://ws.audioscrobbler.com/2.0/';

function yqlQuery(url) {
    let query = `select data-youtube-player-id from html where url="${url}" and compat="html5" and xpath='//div[@data-youtube-player-id]'`;
    return `https://query.yahooapis.com/v1/public/yql?q=${encodeURIComponent(query)}&format=json&diagnostics=false`;
}

@reactMixin.decorate(React.addons.PureRenderMixin)
export default class App extends React.Component {
    state = {
        tracks: [],
        videos: [],
        artistName: '',
        activeIndex: null,
        playing: false,
        currentTime: 0,
        duration: 0,
    }
    static childContextTypes = {
        muiTheme: React.PropTypes.object
    }
    constructor() {
        super();
        this.handleTextInput = this.handleTextInput.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleArtistSearch = this.handleArtistSearch.bind(this);
        this.handleVideoSelect = this.handleVideoSelect.bind(this);
        this.pausePlayToggle = this.pausePlayToggle.bind(this);
        this.playerStateChange = this.playerStateChange.bind(this);
    }
    componentDidMount() {
        this.props.player.addEventListener('onStateChange', this.playerStateChange);
        setInterval(() => {
            if (this.state.playing) {
                this.updateCurrentTime();
            }
        }, 200);
    }
    updateCurrentTime() {
        this.setState({
            currentTime: Math.floor(this.props.player.getCurrentTime()),
            duration: this.props.player.getDuration()
        });
    }
    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    }
    handleArtistSearch() {
        fetch(`${LASTFM_API_BASE}?method=artist.gettoptracks&artist=${this.state.artistName}&api_key=${LASTFM_API_KEY}&format=json`)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    tracks: data.toptracks.track,
                    videos: [],
                    activeIndex: null,
                });
            });
    }
    handleChange(e) {
        this.setState({
            artistName: e.target.value
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
        fetch(yqlQuery(this.state.tracks[index].url))
            .then((response) => response.json())
            .then((data) => {
                let videos = this.state.videos.slice();
                videos[index] = data.query.results.div['data-youtube-player-id'];
                this.setState({
                    videos: videos,
                    activeIndex: index,
                    playing: true,
                });
            });
    }
    componentDidUpdate(prevProps, prevState) {
        // load video every time active index changes
        if (this.state.activeIndex !== null && prevState.activeIndex !== this.state.activeIndex) {
            let activeVideo = this.state.videos[this.state.activeIndex];
            this.props.player.loadVideoById(activeVideo);
        }
    }
    pausePlayToggle() {
        if (this.state.playing === true) {
            this.props.player.pauseVideo();
        } else {
            this.props.player.playVideo();
        }
        this.setState({
            playing: !this.state.playing,
        });
    }
    playerStateChange(event) {
        if (event.data === window.YT.PlayerState.ENDED) {
            let nextIndex = null;
            if (this.state.activeIndex < this.state.tracks.length - 1) {
                nextIndex = this.state.activeIndex + 1;
            }
            this.handleVideoSelect(nextIndex);
        }
    }
    render() {
        return (
            <div>
                <AppBar
                    style={{
                        position: 'fixed',
                        right: 15,
                        left: 15,
                        width: 'auto',
                    }}
                    title={
                        <TimeSlider
                            currentTime={this.state.currentTime}
                            duration={this.state.duration}
                        />
                    }
                    iconElementLeft={
                        <Controls
                            disabled={this.state.activeIndex === null}
                            onClickHandler={this.pausePlayToggle}
                            playing={this.state.playing}
                        />
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
                <div style={{paddingTop: 70, 'position': 'relative'}}>
                    <TextField
                        hintText="Type artist name"
                        value={this.state.artistName}
                        onChange={this.handleChange}
                        onKeyUp={this.handleTextInput}
                    />
                    <FlatButton onClick={this.handleArtistSearch} label="Find" />
                    <Playlist
                        handleVideoSelect={this.handleVideoSelect}
                        activeIndex={this.state.activeIndex}
                        tracks={this.state.tracks}
                    />
                </div>
            </div>
        );
    }
}
