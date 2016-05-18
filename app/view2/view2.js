'use strict';

angular.module('myApp.view2', [
  'ngRoute',
  'myApp.lobby.date-filter'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl',
  ['$scope', '$http', '$location', 'UserModel',
    function(scope, http, location, model) {
    scope.dailies = [];

    scope.changeView = function(view){
      location.path(view);
    };

    if(model.user !== ""){
      http({ method: 'GET', url: '/api/dailies/'})
        .success(function(data, status, headers, config){
          if(status == 200) {
            console.log("stuff happened.");
            scope.dailies = data;
            console.log(data);
          }
        })
        .error(function(data, status, headers, config){
          scope.error = true;
          console.log("stuff didn't happened.");
        });

      scope.select = function(daily) {
        http({method: 'POST', url: '/api/lobby/' + daily.lobbyId, params: {user: model.summonerId}})
          .success(function(data, status, headers, config){
            if(status == 200) {
              console.log("stuff happened.");
              console.log(data);
              var index = scope.dailies.indexOf(daily);
              if(index > -1) scope.dailies.splice(index, 1);
              console.log(scope.dailies);
              model.addLobby(data._id);
            }
          })
          .error(function(data, status, headers, config){
            scope.error = true;
            console.log("stuff didn't happened.");
          });
      }
    }
    else{
      scope.changeView("/view1");
    }
}]);
