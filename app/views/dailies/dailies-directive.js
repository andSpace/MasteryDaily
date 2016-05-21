/**
 * Created by code on 5/19/16.
 */
angular.module('myApp.dailies.dailies-directive', [])
  .directive('dailies', function(){
    return {
      restrict: 'E',
      scope: false,
      templateUrl: 'views/dailies/dailies.html'
    };
  });
