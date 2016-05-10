/**
 * Created by code on 5/9/16.
 */
'use strict';

angular.module('myApp.lobby.date-filter', [])

  .filter('dateify',  function() {
    return function(date) {
      return new Date(date).toLocaleString();
    };
  });
