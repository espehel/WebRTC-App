var _ = require('lodash');
var React = require('react');



module.exports = React.createClass({

    render: function() {
    	return (
    		<div>
				<video height="300" id="localVideo"></video>
                <video id="remoteVideo" autoplay height="500"></video>
                <br/>
				<input type="button" id="start" onclick="start(true)" value="Start Video"></input>
    		</div>
		);
    }

});

