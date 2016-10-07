import React, { PropTypes, PureComponent } from 'react';
import Slider from 'material-ui/Slider';

const STYLES = {
  main: {
    marginTop: 20,
    marginBottom: 0,
  },
};

export default class TimeSlider extends PureComponent {

  static propTypes = {
    currentTime: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    playing: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired,
    onDragStop: PropTypes.func.isRequired,
  }

  render() {
    return (
      <Slider
        step={0.01}
        value={this.props.currentTime / this.props.duration}
        name="progress"
        disabled={!this.props.playing}
        style={STYLES.main}
        onChange={this.props.onChange}
        onDragStart={this.props.onDragStart}
        onDragStop={this.props.onDragStop}
      />
    );
  }

}
