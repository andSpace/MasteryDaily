/**
 * Created by code on 5/4/16.
 */

angular.module('myApp.UserModel', [])

  .factory('UserModel', function() {
    var UserModel = {};
    UserModel.user = "";
    UserModel.summonerid = "";
    UserModel.lobbyIds = [];

    UserModel.addLobby = function(id){
      if(!UserModel.hasLobby(id))
        UserModel.lobbyIds.push(id);
    };

    UserModel.hasLobby = function(id){
      return UserModel.lobbyIds.includes(id);
    };

    return UserModel;
  });
