/**
 * Created by code on 5/3/16.
 */

'use strict';

var Lobby = require('./lobby.model');
var Summoner = require('../summoner/summoner.model');
var Warden = require('../../components/rito_jail/warden');
var _ = require('lodash');

exports.show = function(req, res) {
  //todo probably change, when you have to do this much nonsense it's probably wrong.
  var obj = {};
  obj['users.' + req.params.id] = {$exists: true};
  Lobby.find(obj)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

exports.join = function(req, res) {
  Summoner.findOne({summonerid : req.query.user})
    .then(handleEntityNotFound())
    .then(updateMastery())
    .then(findLobby(req.params.id))
    .then(handleEntityNotFound())
    .then(saveUpdates())
    .then(responseWithResult(res))
    .catch(handleError(res));
};

function updateMastery(){
  return function(summoner){
    if(summoner.masterUpdate > Date.now() + (5 * 60 * 1000))
      return summoner;

    return Warden.fetchMastery(summoner.summonerid)
      .then(function(mastery){
          summoner.mastery = mastery;
          summoner.masteryUpdate = Date.now();
          summoner.markModified('mastery');
          summoner.markModified('masterUpdate');
          summoner.save();
          return summoner;
      })
      .catch(function(status){
        throw new Exception(status, "fetchMastery failed.");
      });
  }
}

function findLobby(id){
  return function(summoner) {
    return Lobby.findById(id)
      .then(function(lobby){
        //store user stats.
        lobby.users = lobby.users || {};
        lobby.beginningStats = lobby.beginningStats || {};
        lobby.endingStats = lobby.endingStats || {};

        var points = 0;
        _.each(summoner.mastery, function (val) {
          if (val.championId == lobby.champFilter[0]) {
            points = val.championPoints;
          }
        });

        var gracePeriod = Date.now() - (60 * 60 * 1000)
        if(lobby.dateEnd < gracePeriod) {
          console.log("Time now with grace: ", new Date(gracePeriod));
          console.log("End time: ", new Date(lobby.dateEnd));
          throw new Exception(403, lobby._id + " : " + lobby.name + " is past due.");
        }

        if(summoner.summonerid in lobby.users ||
          summoner.summonerid in lobby.beginningStats) {
          lobby.endingStats[summoner.summonerid] = { points: points };
        } else {
          lobby.users[summoner.summonerid] = {joined: Date.now()}; //todo -- but why anymore?
          lobby.beginningStats[summoner.summonerid] = { points: points };
          lobby.endingStats[summoner.summonerid] = { points: points };

          lobby.markModified('users');
          lobby.markModified('beginningStats');
        }
        lobby.markModified('endingStats');

        return lobby;
      });
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.log(err);
    return res.status(err.status || statusCode).json(err.message || err);
  };
}

function handleEntityNotFound() {
  return function(entity) {
    if (!entity) {
      throw new Exception(404, "Entity not found.");
    }
    return entity;
  };
}

function saveUpdates() {
  return function(entity) {
    return entity.save()
      .then(function(updated) {
        return updated;
      })
      .catch(function(err){
        console.log("Failed to update: ", entity, err);
      });
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function Exception(status, message) {
  this.message = message;
  this.status = status;
}
