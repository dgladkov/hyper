import React from 'react';
import reactMixin from 'react-mixin';
import { IconButton } from 'material-ui';

@reactMixin.decorate(React.addons.PureRenderMixin)
export default class Controls extends React.Component {
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
                    onClick={this.props.onClickHandler}
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
