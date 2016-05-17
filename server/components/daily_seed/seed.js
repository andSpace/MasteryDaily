/**
 * Created by code on 5/3/16.
 */
var Daily = require('../../api/dailies/dailies.model');
var Lobby = require('../../api/lobby/lobby.model');
var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;

var champData = require('../rito_static/champions-lite');
var keys = Object.keys(champData);
var startingTime = Date.now();
var endingTime = startingTime + (1000*60*59*24);

var promiseFor = Promise.method(function(condition, action, value) {
  if (!condition(value)) return value;
  return action(value).then(promiseFor.bind(null, condition, action));
});

function championHelper(){
  var max = keys.length;
  var num = Math.floor(Math.random() * max);
  var champid = keys[num];
  keys.splice(num, 1);
  return champid;
}

function createDaily(champName, champid, lobbyid){
  return Daily.create({
    championName: champName,
    championId: champid, //generate random champion
    lobbyId: lobbyid, //create new lobby
    dateEnd: endingTime
  }).catch(function(err){
    console.log(err);
  });
}

function createLobby(){
  var champid = championHelper();
  return Lobby.create({
    name : champData[champid].name, users : {},
    begingStats : {}, endingStats : {},
    dateStart : startingTime, dateEnd : endingTime,
    champFilter : [ champid ], finished : false
  })
    .then(function (value) {
      return createDaily(champData[champid].name, champid, value._id);
    })
    .then(function (daily){
      return daily;
    })
    .catch(function (err) {
      console.log(err);
    });
}

function populateDailies(){
  //return promiseFor(function(count) {
  //  return count < 3;
  //},
  //function(count) {
  //  return createLobby()
  //    .then(function() {
  //      return ++count;
  //    });
  //},
  //0);
  return createLobby();
}

mongoose.connect('mongodb://localhost/urf3');

Daily.find({ dateEnd: {$lte: Date.now()}}).remove()
  .then(populateDailies)
  .then(function(){ mongoose.connection.close(); })
  .catch(function(err){console.log(err);});
