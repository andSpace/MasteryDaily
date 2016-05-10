/**
 * Created by code on 4/28/16.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var postSchema = new Schema({
  name: String,
  summonerid: String,
  mastery: Object,
  masterUpdate: String
});

module.exports = mongoose.model('Summoner', postSchema);
