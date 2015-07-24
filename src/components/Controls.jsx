import React from 'react';
import {
    IconButton
} from 'material-ui';

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
                    {this.props.playing === true ? 'pause' : 'play_arrow'}
                </IconButton>
            </div>
        );
    }
}
