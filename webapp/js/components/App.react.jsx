var React = require('react');
var LocalVideo = require('./LocalVideo.react');


module.exports = React.createClass({

    getInitialState: function(){
        return {
            localStream:null
        };
    },
    componentDidMount: function(){
        remoteVideo = document.getElementById('remoteVideo');

        serverConnection = new WebSocket('ws://localhost:3434');
        serverConnection.onmessage = gotMessageFromServer;

        var constraints = {
            video: true,
            audio: true
        };

        if(navigator.getUserMedia) {
            navigator.getUserMedia(constraints, this.getUserMediaSuccess, getUserMediaError);
        } else {
            alert('Your browser does not support getUserMedia API');
        }
    },
    getUserMediaSuccess: function(stream){
        localStream = stream;
        this.setState({localStream: stream});
    },

    render: function() {
        console.log("app", this.state.localStream);
        return (
            <div>
                <LocalVideo localStream={this.state.localStream}/>
                <video id="remoteVideo" autoPlay height="500"></video>
                <br/>
                <input type="button" id="start" onclick="start(true)" value="Start Video"></input>
            </div>
        );
    }

});


//init

var remoteVideo;
var peerConnection;
var peerConnectionConfig = {'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]};

navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;


function getUserMediaError(error) {
    console.log(error);
}

//call

function start(isCaller) {
    peerConnection = new RTCPeerConnection(peerConnectionConfig);

    // send any ice candidates to the other peer
    peerConnection.onicecandidate = function (event) {
        console.log("onIceCandidate");
        if(event.candidate != null) {
            serverConnection.send(JSON.stringify({'candidate': event.candidate}));
        }
    };

    // once remote stream arrives, show it in the remote video element
    peerConnection.onaddstream = function (event) {
        console.log("got remote stream");
        remoteVideo.src = window.URL.createObjectURL(event.stream);
    };

    peerConnection.addStream(localStream);

    if(isCaller) {
        console.log("iscaller");
        peerConnection.createOffer(gotDescription, createOfferError);
    } else {
        console.log("is not caller");
        pc.createAnswer(peerConnection.remoteDescription, gotDescription);
    }
}

function gotDescription(description) {
    console.log('got description');
    peerConnection.setLocalDescription(description, function () {
        serverConnection.send(JSON.stringify({'sdp': description}));
    }, function() {console.log('set description error')});
}

function createOfferError(error) {
    console.log(error);
}

//receive call

function gotMessageFromServer(message) {
    console.log("got message from server",message);
    if(!peerConnection) {
        start(false);
    }

    var signal = JSON.parse(message.data);
    if(signal.sdp) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));/*, function() {
         peerConnection.createAnswer(gotDescription, createAnswerError);
         });*/
    } else if(signal.candidate) {
        peerConnection.addIceCandidate(new RTCIceCandidate(signal.candidate));
    }
}


