import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './components/App';

injectTapEventPlugin();

window.onYouTubeIframeAPIReady = function() {
    let player = new window.YT.Player('hidden');
    React.render(<App player={player} />, document.getElementById('app'));
};
