/**
 * Created by code on 4/28/16.
 */
'use strict';

// Get a single stats
var User = require('./summoner.model');
var Warden = require('../../components/rito_jail/warden');

exports.show = function(req, res) {
  console.log(req.params);
  User.findOne({name : req.params.id})
    .then(handleEntityNotFound(req, res))
    .then(function(entity) {return res.json(entity)})
    .catch(function(){return function(err){console.log(err);}});
  //
  //
  //  , function (err, stats) {
  //  if(err) { return handleError(res, err); }
  //  console.log(stats);
  //  if(!stats) {
  //    var user = Warden.lookupUser(req.params.id);
  //    if(user) {
  //      var record = new User();
  //      record.name = req.params.id;
  //      record.summonerid = user;
  //      record.save();
  //      return res.json(record);
  //    } else {
  //      return res.sendStatus(404);
  //    }
  //  } else {
  //    return res.json(stats);
  //  }
  //});
};

// Creates a new stats in the DB.
exports.create = function(req, res) {
  User.create(req.body, function(err, stats) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(stats);
  });
};

function handleEntityNotFound(req, res) {
  return function(entity) {
    console.log("wait how?", entity);
    if (!entity) {
      var user = Warden.lookupUser(req.params.id);
      if(user) {
        return User.create({
          name: user, //generate random champion
          summonerid: user //create new lobby
        }).catch(function(err){
          console.log(err);
        });
      } else {
        res.status(404).end();
        return null;
      }
    }
    return entity;
  };
}

function handleError(res, err) {
  return res.status(500).json(err);
}
