import React from 'react';
import reactMixin from 'react-mixin';
import { Slider } from 'material-ui';

@reactMixin.decorate(React.addons.PureRenderMixin)
export default class Time extends React.Component {
    render() {
        let currentPercent = this.props.currentTime / this.props.duration;
        return (
            <Slider
                step={0.01}
                value={currentPercent}
                name="progress"
                disabled={!this.props.playing}
                style={{marginTop: 20, marginBottom: 0}}
                onChange={this.props.onChange}
            />
        );
    }
}
