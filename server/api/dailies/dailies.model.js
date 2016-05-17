/**
 * Created by code on 5/3/16.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var postSchema = new Schema({
  championName: String,
  championId: String,
  lobbyId: String,
  dateEnd: Number
});

module.exports = mongoose.model('Daily', postSchema);
