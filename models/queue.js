var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
var queueSchema = new Schema({
    name: String,
    items: Array
});

module.exports = mongoose.model('Queue', queueSchema);