'use strict';

angular.module('myApp.version.version-directive', [])

.directive('appVersion', ['version', 'UserModel', function(version, model) {
  //return function(elm, attrs) {
  //  scope.$watch(model, function(newValue){
  //    console.log("OMG HAPPENED");
  //    console.log(newValue);
  //    console.log(model);
  //    console.log(model.user);
  //    elm.text('Welcome: ' + model.user);
  //  });
  //  elm.text('Welcome: ' + model.user);
  //  console.log(model);
  //};
    return {
      restrict: 'A',
      require: '?UserModel',
      link: function(scope){
        console.log(scope, model);
        console.log(model.user);
        scope.$watch(attrs.UserModel, function(newValue){
          console.log('changed', newValue);
        });
      }
    }
}]);
