import React, { PropTypes, PureComponent } from 'react';

function secondsToTimestamp(secondsTotal) {
  let minutes = Math.floor(secondsTotal / 60);
  let seconds = secondsTotal - (minutes * 60);
  let pad = (x) => x < 10 ? '0' + x.toString() : x;
  return `${pad(minutes)}:${pad(seconds)}`;
}

export default class Time extends PureComponent {

  static propTypes = {
    currentTime: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
  }

  render() {
    return (
      <div>
        {secondsToTimestamp(this.props.currentTime)}
        /
        {secondsToTimestamp(this.props.duration)}
      </div>
    );
  }

}
