import React, { PureComponent } from 'react';
import Slider from 'material-ui/Slider';

const STYLES = {
  main: {
    marginTop: 20,
    marginBottom: 0,
  },
};

export default class TimeSlider extends PureComponent {
  render() {
    const currentPercent = this.props.currentTime / this.props.duration;
    return (
      <Slider
        step={0.01}
        value={currentPercent}
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
