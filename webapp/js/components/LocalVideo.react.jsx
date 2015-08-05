var React = require('react');

module.exports = React.createClass({

    render: function() {
        return (
            <video height="300" id="localVideo" autoPlay src={URL.createObjectURL(this.props.localStream)}></video>
        );
    }

});