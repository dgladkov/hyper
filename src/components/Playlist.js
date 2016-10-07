import React, { PropTypes, PureComponent } from 'react';
import { List, ListItem } from 'material-ui/List';

const STYLES = {
  activeItem: {
    backgroundColor: '#00bcd4',
    color: '#ffffff',
  },
};

export default class Playlist extends PureComponent {

  static propTypes = {
    tracks: PropTypes.array.isRequired,
    activeIndex: PropTypes.number,
    handleVideoSelect: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
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
