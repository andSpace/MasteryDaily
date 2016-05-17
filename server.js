'use strict';

// simple express server
var express = require('express');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var app = express();

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/urf3');

app.set('views', '/server/views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(express.static('./dist'));
app.get('/', function(req, res) {
  res.sendFile('index.html');
});



require('./server/routes')(app);

app.listen(process.env.PORT || 5000);
exports = module.exports = app;
