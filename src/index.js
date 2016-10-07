import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './components/App';

injectTapEventPlugin();

window.onYouTubeIframeAPIReady = function() {
  const player = new window.YT.Player('hidden');
  ReactDOM.render(<App player={player} />, document.getElementById('app'));
};
