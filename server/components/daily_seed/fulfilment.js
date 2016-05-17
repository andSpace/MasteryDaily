/**
 * Created by code on 5/10/16.
 */
var Lobby = require('../../api/lobby/lobby.model');
var LobbyCtrl = require('../../api/lobby/lobby.controller');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var request = require('request-promise');
var rateLimit = require('rate-limit');
var _ = require('lodash');
mongoose.Promise = Promise;

var queue = rateLimit.createQueue({interval: 1500});

function updateLobbies(){
  return function(lobbies){
    _.each(lobbies, function(val) {
      _.each(val.users, function (v, k) {
        var options = {
          method: 'POST',
          uri: 'http://localhost:' + process.env.PORT + '/api/lobby/' + val._id + '?user=' + k
        };
        queue.add(function(){makeRequest(options, val)});
      });
      queue.add(function(){markLobby(val)});
    });
    queue.add(function(){process.exit(0);})
  }
}

function makeRequest(options, lobby){
  request(options)
    .catch(function (err) {  console.log(err);   });
}

function markLobby(lobby){
  lobby.finished = true;
  lobby.markModified('finished');
  lobby.save()
    .then(function(){ console.log(lobby.name, lobby.finished); })
    .catch(function (err) {  console.log(err); });
}

setTimeout(function(){process.exit(1);}, 1000 * 60 * 55);
mongoose.connect('mongodb://localhost/urf3');

Lobby.find({ $and : [ { dateEnd: {$lte: Date.now()}}, { finished : false }]})
  .then(updateLobbies())
  .catch(function(err){console.log(err);});
