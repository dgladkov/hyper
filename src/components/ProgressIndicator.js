import React, { PropTypes, PureComponent } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const STYLES = {
  main: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    width: 140,
    height: 140,
    marginTop: -70, /* Half the height */
    marginLeft: -70, /* Half the width */
    zIndex: 99,
  },
};

export default class ProgressIndicator extends PureComponent {

  static propTypes = {
    show: PropTypes.bool.isRequired,
  }

  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div style={STYLES.main}>
        <CircularProgress mode="indeterminate" size={60} />
      </div>
    );
  }

}
