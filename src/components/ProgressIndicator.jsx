import React from 'react';
import reactMixin from 'react-mixin';
import { CircularProgress, Paper } from 'material-ui';

const STYLES = {
    main: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 140,
        height: 140,
        marginTop: -70, /* Half the height */
        marginLeft: -70, /* Half the width */
        zIndex: 99,
    }
};

@reactMixin.decorate(React.addons.PureRenderMixin)
export default class ProgressIndicator extends React.Component {
    render() {
        if (!this.props.show) {
            return null;
        }
        return (
            <div style={STYLES.main}>
                <CircularProgress mode="indeterminate" size={2} />
            </div>
        );
    }
}
