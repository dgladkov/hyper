import React from 'react';
import reactMixin from 'react-mixin';

function secondsToTimestamp(secondsTotal) {
    let minutes = Math.floor(secondsTotal / 60);
    let seconds = secondsTotal - (minutes * 60);
    let pad = (x) => x < 10 ? '0' + x.toString() : x;
    return `${pad(minutes)}:${pad(seconds)}`;
}

@reactMixin.decorate(React.addons.PureRenderMixin)
export default class Time extends React.Component {
    render() {
        return (
            <div>
                {secondsToTimestamp(this.props.currentTime)} / {secondsToTimestamp(this.props.duration)}
            </div>
        );
    }
}
