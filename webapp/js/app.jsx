var React = require('react');

var App = require('./components/App.react');

var WebRTC = require('webrtc');

var RTCFactory = require('webrtc-adapter');

React.render(
    <App />,
    document.getElementById('app')
);
