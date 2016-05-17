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
  console.log({summonerid : req.query.user});
  Summoner.findOne({summonerid : req.query.user})
    .then(handleEntityNotFound())
    .then(updateMastery())
    .then(findLobby(req.params.id))
    .then(handleEntityNotFound())
    .then(saveUpdates(req.query))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

function updateMastery(){
  return function(summoner){
    if(summoner.masterUpdate > Date.now() + (5 * 60 * 1000))
      return summoner;

    return Warden.fetchMastery(summoner.summonerid)
      .then(function(res){ //console.log(res.statusCode);
        if (res.statusCode == 200)
          return res.body;
        else
          reject(res.statusCode);
      })
      .then(function(mastery){
          summoner.mastery = mastery;
          summoner.masteryUpdate = Date.now();
          summoner.markModified('mastery');
          summoner.markModified('masterUpdate');
          summoner.save();
          return summoner;
      })
      .catch(function(err){ console.log(err);});
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

        if(lobby.dateEnd < Date.now() + (60 * 60 * 1000) )
          return null;

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
      })
      .catch(function(err) {
        return null;
      });
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).json(err);
  };
}

function handleEntityNotFound() {
  return function(entity) {
    if (!entity) {
      throw(404); //todo -- apparently not good? but its <3hr and you know good code comes under pressure.
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
  //  entity.users = entity.users || {};
  //  if(updates.user in entity.users) {
  //    reject(updates.user);
  //  }
  //
  //  entity.users[updates.user] = {joined: Date.now()};
  //  entity.markModified('users');
    return entity.save()
      .then(function(updated) {
        return updated;
      }).catch(function(err){console.log(err);});
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
