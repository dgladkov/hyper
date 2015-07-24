import React from 'react';
import {
    IconButton
} from 'material-ui';

export default class Controls extends React.Component {
    static propTypes = {
        disabled: React.PropTypes.bool,
        onClickHandler: React.PropTypes.func,
        player: React.PropTypes.object,
    }
    constructor() {
        super();
        this.isPlaying = this.isPlaying.bind(this);
    }
    isPlaying() {
        return true //this.props.player.getPlayerState() === window.YT.PlayerState.PLAYING;
    }
    render() {
        return (
            <div>
                <IconButton
                    onClick={this.props.onClickHandler}
                    iconClassName="material-icons"
                    disabled={this.props.disabled}
                >
                    {this.isPlaying() ? 'pause' : 'play_arrow'}
                </IconButton>
            </div>
        );
    }
}
