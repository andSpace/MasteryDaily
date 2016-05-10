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
  ['$scope', '$http', 'UserModel',
  function(scope, http, model) {
    scope.lobbies = {};

    if(model.user !== "") {
      http({method: 'GET', url: '/api/lobby/' + model.user})
        .success(function (data, status, headers, config) {
          if (status == 200) {
            scope.lobbies = data;
          }
        })
        .error(function (data, status, headers, config) {
          console.log("stuff didn't happened.");
        });
    }
}]);
