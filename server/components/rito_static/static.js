/**
 * Created by code on 5/7/16.
 */
'use strict';

var fs = require('fs');
var request = require('request');
var _ = require('lodash');

var base = 'https://global.api.pvp.net';

var region = 'na';
var apiPoint = '/api/lol/static-data/' + region + '/v1.2/champion?champData=all';
var apiKey = '&api_key=' + process.env.RIOTAPIKEY;

//https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=all&api_key=

var url = base + apiPoint + apiKey;
request(url, function (error, response, body) {
  if(!error || response.statusCode == 200){
    writeChampion(body);
    writeChampionLite(JSON.parse(body));
  }
});

function writeChampion(body){
  fs.writeFileSync("champions.json", body);
}

function writeChampionLite(body){
  var lite = {};
  _.forEach(body.keys, function(value, key){
    lite[key] = {
      key : value ,
      name: body.data[value].name,
      title : body.data[value].title
    };
  });

  fs.writeFileSync("champions-lite.json", JSON.stringify(lite));
}
