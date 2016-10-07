import React, { PropTypes, PureComponent } from 'react';
import Slider from 'material-ui/Slider';

const STYLES = {
  main: {
    display: 'flex',
    flexDirection: 'row',
  },
  timeSlider: {
    flex: 1,
    marginLeft: 20,
  },
  volumeSlider: {
    width: '100px',
  },
};

export default class Sliders extends PureComponent {

  static propTypes = {
    currentTime: PropTypes.number.isRequired,
    currentVolume: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    playing: PropTypes.bool.isRequired,
    onTimeChange: PropTypes.func.isRequired,
    onTimeDragStart: PropTypes.func.isRequired,
    onTimeDragStop: PropTypes.func.isRequired,
    onVolumeChange: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div style={STYLES.main}>
        <Slider
          step={1}
          min={0}
          max={100}
          value={this.props.currentVolume}
          name="volume"
          disabled={!this.props.playing}
          style={STYLES.volumeSlider}
          onChange={this.props.onVolumeChange}
        />
        <Slider
          step={0.01}
          value={this.props.currentTime / this.props.duration}
          name="progress"
          style={STYLES.timeSlider}
          disabled={!this.props.playing}
          onChange={this.props.onTimeChange}
          onDragStart={this.props.onTimeDragStart}
          onDragStop={this.props.onTimeDragStop}
        />
      </div>
    );
  }

}
