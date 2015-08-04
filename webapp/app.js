var http = require('http');
var _ = require('lodash');
var express = require('express');
var util = require('util');
var historyApiFallback = require('connect-history-api-fallback');
historyApiFallback.setLogger(console.log.bind(console));


var app = express();
app.use(express.static('dist'));
app.use(historyApiFallback);
app.use(express.static('public'));

app.use(function(err, req, res, next){
    console.error(err.stack);
    next(err);
});

app.use(function(err, req, res, next) {
    util.inspect(err);
    res.status(500).send({ error: err.message });
});

var server = http.createServer(app);
server.listen(9999);

