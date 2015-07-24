import React from 'react';
import {
    List,
    ListItem,
} from 'material-ui';

const STYLES = {
    activeItem: {
        backgroundColor: '#00bcd4',
        color: '#ffffff'
    }
};

export default class Playlist extends React.Component {
    static propTypes = {
        tracks: React.PropTypes.array,
        activeIndex: React.PropTypes.number,
        handleVideoSelect: React.PropTypes.func,
    }
    handleItemClick(index) {
        this.props.handleVideoSelect(index);
    }
    render() {
        return (
            <div>
                <List>
                    {this.props.tracks.map((track, index) => (
                        <ListItem
                            key={index}
                            onClick={this.handleItemClick.bind(this, index)}
                            primaryText={track.name}
                            style={index === this.props.activeIndex ? STYLES.activeItem : null}
                        />
                    ))}
                </List>
            </div>
        );
    }
}
