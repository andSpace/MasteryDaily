/**
 * Created by code on 5/9/16.
 */
'use strict';

angular.module('myApp.lobby.lobby-directive', [])
  .controller('LobbyCtrl', ['$scope', function($scope) {

  }])
  .directive('lobby', function($http){
    return {
      restrict: 'E',
      scope: {
        lobby: '=',
        model: '='
      },
      templateUrl: 'views/lobby/lobby.html'
      //link: function(scope, element, attrs){
      //  $templateRequest('views/lobby/lobby.html')
      //    .then(function(html){
      //      element.append($compile(html)(scope));
      //    });
      //}
    };
  });
