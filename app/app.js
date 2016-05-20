'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'LocalStorageModule',
  'myApp.view1',
  'myApp.lobby',
  'myApp.lobbies',
  'myApp.version',
  'myApp.UserModel',
  'myApp.dailies.dailies-directive'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
