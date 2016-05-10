/**
 * Created by code on 5/3/16.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var postSchema = new Schema({
  name: String,
  users: Object,
  beginningStats: Object,
  endingStats: Object,
  dateStart: Number,
  dateEnd: Number
});

module.exports = mongoose.model('Lobby', postSchema);
