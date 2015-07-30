import React from 'react';
import reactMixin from 'react-mixin';
import { List, ListItem } from 'material-ui';

const STYLES = {
    activeItem: {
        backgroundColor: '#00bcd4',
        color: '#ffffff'
    }
};

@reactMixin.decorate(React.addons.PureRenderMixin)
export default class Playlist extends React.Component {
    static propTypes = {
        tracks: React.PropTypes.array,
        activeIndex: React.PropTypes.number,
        handleVideoSelect: React.PropTypes.func,
    }
    handleItemClick(index) {
        if (!this.props.loading) {
            this.props.handleVideoSelect(index);
        }
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
