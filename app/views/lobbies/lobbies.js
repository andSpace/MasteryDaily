/**
 * Created by code on 5/8/16.
 */
'use strict';

angular.module('myApp.lobbies', ['ngRoute'])

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

    if(model.user !== "") {
      http({method: 'GET', url: '/api/lobby/' + model.summonerId})
        .success(function (data, status, headers, config) {
          if (status == 200) {
            console.log(data);
            scope.lobbies = data;
          }
        })
        .error(function (data, status, headers, config) {
          console.log("stuff didn't happened.");
        });
    }
    else{
      scope.changeView("/view1");
    }
}]);
