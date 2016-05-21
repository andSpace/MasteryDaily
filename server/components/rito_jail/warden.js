/**
 * Created by code on 5/2/16.
 */

var request = require('request-promise');

var region = 'na';
var region_new = 'NA1'; //whyyyyy.jpg
var base = 'https://' + region + '.api.pvp.net'; //doesn't work on global :( rito pls.
var apiKey = 'api_key=' + process.env.RIOTAPIKEY;

//user: /api/lol/{region}/v1.4/summoner/by-name/{summonerNames}

exports.lookupUser = function(id){
  if(id){
    var url = base + '/api/lol/' + region  + '/v1.4/summoner/by-name/' + id + '?' + apiKey;
    return request({
      uri: url,
      json: true,
      resolveWithFullResponse: true
    });
  }
  return null;
};

//mastery: /championmastery/location/{platformId}/player/{playerId}/champions

exports.fetchMastery = function(id){
  if(id){
    var url = base + '/championmastery/location/' + region_new + '/player/' + id + '/champions?' + apiKey;
    return request({
      uri: url,
      json: true,
      resolveWithFullResponse: true
    })
    .then(function(res){
        if (res.statusCode == 200) {
          return res.body;
        } else {
          console.log('fetchMastery failed with code: ' + res.statusCode + ' for ' + id);
          throw(res.statusCode);
        }
    });
  }
  return null;
};
