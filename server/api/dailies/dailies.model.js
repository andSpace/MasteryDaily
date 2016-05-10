/**
 * Created by code on 5/3/16.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var postSchema = new Schema({
  championId: String,
  lobbyId: String
});

module.exports = mongoose.model('Daily', postSchema);
