/**
 * Created by code on 5/3/16.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var postSchema = new Schema({
  userid: String,
  mastery: Object
});

module.exports = mongoose.model('Lobby', postSchema);
