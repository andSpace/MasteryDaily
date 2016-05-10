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
    .then(function(entity) {
      if(entity)
        return res.json(entity)
      else
        throw(404); //todo why doesn't return null work here?
    })
    .catch(function(err){
      console.log(err);
      handleError(res, err)});
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
    if (!entity) {

      return Warden.lookupUser(req.params.id)
        .then(function(res){
          console.log(res.statusCode);
          if(res && res.statusCode == 200) {
            for (var o in res.body) { //todo probably change because this is super dumb.
              return res.body[o].id;
            }
          }
          return null;  /*shouldn't happen, but yolo?*/
        })
        .then(function(user){
            return User.create({
              name: req.params.id, //generate random champion
              summonerid: user //create new lobby
            }).then(function(user){ return user; })
              .catch(function (err) {
              console.log(err);
            });
          })
        .catch(function(err){
          return null;
        });
    }
    else{
      return entity;
    }
//todo clean this up -- this is promise spaghetti
  };
}

function handleError(res, err) {
  return res.status(500).json(err);
}
