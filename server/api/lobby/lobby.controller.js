/**
 * Created by code on 5/3/16.
 */

'use strict';

var Lobby = require('./lobby.model');
var Warden = require('../../components/rito_jail/warden');

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
  Lobby.findById(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.query))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    console.log("wait how?", entity);
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    entity.users = entity.users || {};
    if(updates.user in entity.users) {
      reject(updates.user);
    }

    entity.users[updates.user] = {joined: Date.now()};
    entity.markModified('users');
    return entity.save()
      .then(function(updated) {
        console.log(updated);
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
