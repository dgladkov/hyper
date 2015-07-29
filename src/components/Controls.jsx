import React from 'react';
import reactMixin from 'react-mixin';
import {
    IconButton
} from 'material-ui';

@reactMixin.decorate(React.addons.PureRenderMixin)
export default class Controls extends React.Component {
    static propTypes = {
        disabled: React.PropTypes.bool,
        onClickHandler: React.PropTypes.func,
        playing: React.PropTypes.bool,
    }
    render() {
        return (
            <div>
                <IconButton
                    onClick={this.props.onClickHandler}
                    iconClassName="material-icons"
                    disabled={this.props.disabled}
                >
                    fast_rewind
                </IconButton>
                <IconButton
                    onClick={this.props.onClickHandler}
                    iconClassName="material-icons"
                    disabled={this.props.disabled}
                >
                    {this.props.playing === true ? 'pause' : 'play_arrow'}
                </IconButton>
                <IconButton
                    onClick={this.props.onClickHandler}
                    iconClassName="material-icons"
                    disabled={this.props.disabled}
                >
                    fast_forward
                </IconButton>
            </div>
        );
    }
}
