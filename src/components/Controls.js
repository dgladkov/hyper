import React, { PureComponent } from 'react';
import IconButton from 'material-ui/IconButton';

export default class Controls extends PureComponent {
  static propTypes = {
    disabled: React.PropTypes.bool,
    handleVideoSelect: React.PropTypes.func,
    onPlayPauseHandler: React.PropTypes.func,
    playing: React.PropTypes.bool,
  }
  render() {
    return (
      <div>
        <IconButton
          onClick={() => this.props.handleVideoSelect(this.props.activeIndex - 1)}
          iconClassName="material-icons"
          disabled={this.props.activeIndex === null || this.props.activeIndex === 0}
        >
          fast_rewind
        </IconButton>
        <IconButton
          onClick={this.props.onPlayPauseHandler}
          iconClassName="material-icons"
          disabled={this.props.activeIndex === null}
        >
          {this.props.playing === true ? 'pause' : 'play_arrow'}
        </IconButton>
        <IconButton
          onClick={() => this.props.handleVideoSelect(this.props.activeIndex + 1)}
          iconClassName="material-icons"
          disabled={this.props.activeIndex === null || this.props.activeIndex === this.props.tracks.length - 1}
        >
          fast_forward
        </IconButton>
      </div>
    );
  }
}
