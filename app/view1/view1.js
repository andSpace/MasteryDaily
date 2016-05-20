'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl',
  ['$scope', '$http', '$location', 'UserModel', 'localStorageService',
  function(scope, http, location, model, storage) {
    scope.error = false;
    scope.username = "";

    scope.changeView = function(view){
      location.path(view);
    };

    var store = storage.get('model');
    if(store) {
      if(!model.user){ //change to lobbies on first try, otherwise let set new user
        model.user = store.user;
        model.summonerId = store.summonerId;
        scope.changeView("/lobbies");
      }
    }

    scope.submit = function(){
      http({ method: 'GET', url: '/api/summoner/' + scope.username})
        .success(function(data, status, headers, config){
          if(status == 200) {
            scope.error = false;
            model.user = scope.username;
            model.summonerId = data.summonerid;
            storage.set('model', model);

            console.log("model1", model.user, data.summonerid);
            scope.changeView("/lobbies");
          }
        })
        .error(function(data, status, headers, config){
          scope.error = true;
          console.log("stuff didn't happened.");
        });
    }
}]);
