/**
 * Created by code on 5/11/16.
 */
'use strict';

angular.module('myApp.lobbies.complete-filter', [])

  .filter('completeify',  function() {
    return function(status) {
      return status ? "(Completed)" : "";
    };
  });
