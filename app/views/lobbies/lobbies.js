/**
 * Created by code on 5/8/16.
 */
'use strict';

angular.module('myApp.lobbies', [
  'ngRoute',
  'myApp.dailies.dailies-directive',
  'myApp.lobbies.complete-filter'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/lobbies', {
    templateUrl: 'views/lobbies/lobbies.html',
    controller: 'LobbiesCtrl'
  });
}])

.controller('LobbiesCtrl',
  ['$scope', '$http', '$location', 'UserModel',
    function(scope, http, location, model) {
    scope.lobbies = {};
    scope.model = model;

    scope.changeView = function(view){
      location.path(view);
    };

    scope.getUserLobbies = function(){
      http({method: 'GET', url: '/api/lobby/' + model.summonerId})
        .success(function (data, status, headers, config) {
          if (status == 200) {
            scope.lobbies = data;
            data.forEach(function(entry){ model.addLobby(entry._id); });
            scope.getDailies();
          }
        })
        .error(function (data, status, headers, config) {
          console.log("User does not have any lobbies.");
          scope.getDailies();
        });
    };

    scope.getDailies = function(){
      http({ method: 'GET', url: '/api/dailies/'})
        .success(function(data, status, headers, config){
          if(status == 200) {
            scope.dailies = [];
            data.forEach(function(entry){
              if(!model.hasLobby(entry.lobbyId)) scope.dailies.push(entry);
            });
          }
        })
        .error(function(data, status, headers, config){
          console.log("Failed to get dailies.");
        });
    };

    scope.select = function(daily) {
      http({method: 'POST', url: '/api/lobby/' + daily.lobbyId, params: {user: model.summonerId}})
        .success(function(data, status, headers, config){
          if(status == 200) {
            var index = scope.dailies.indexOf(daily);
            if(index > -1) scope.dailies.splice(index, 1);
            scope.getUserLobbies();
          }
        })
        .error(function(data, status, headers, config){
          console.log("Unable to join the lobby.");
        });
    };

    if(model.user !== "") {
      scope.getUserLobbies();
    }
    else{
      scope.changeView("/view1");
    }
}]);
